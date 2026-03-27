import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';
import chroma from 'chroma-js';
import { ColorPair, ContrastReport } from '@/utils/colorContrast';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Fetch the webpage
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
      validateStatus: () => true,
    });

    if (response.status === 403 || response.status === 401) {
      return res.status(422).json({ error: `The site blocked the request (HTTP ${response.status}). Try uploading the HTML/CSS files directly instead.` });
    }
    if (response.status >= 400) {
      return res.status(422).json({ error: `The site returned an error (HTTP ${response.status}). Check the URL and try again.` });
    }

    const html = response.data;
    
    // Parse HTML
    const $ = cheerio.load(html);
    
    // Extract inline styles and external CSS
    const colorPairs: ColorPair[] = [];
    const seenPairs = new Set<string>();

    // Function to extract color from computed style
    const extractColor = (value: string): string | null => {
      if (!value || value === 'transparent' || value === 'inherit' || value === 'initial' || value === 'none') {
        return null;
      }
      try {
        return chroma(value).hex();
      } catch {
        return null;
      }
    };

    // Function to calculate contrast
    const calculateContrast = (fg: string, bg: string): number => {
      try {
        return chroma.contrast(fg, bg);
      } catch {
        return 0;
      }
    };

    // Parse all elements with text content
    $('*').each((_, element) => {
      const $element = $(element);
      
      // Skip elements without visible text
      const text = $element.text().trim();
      if (!text || text.length === 0) return;
      
      // Skip script, style, meta tags
      const tagName = element.name.toLowerCase();
      if (['script', 'style', 'meta', 'link', 'noscript'].includes(tagName)) return;

      // Get inline styles
      const style = $element.attr('style') || '';
      
      // Extract colors from inline styles
      let foreground: string | null = null;
      let background: string | null = null;

      // Check inline color
      const colorMatch = style.match(/color\s*:\s*([^;]+)/i);
      if (colorMatch) {
        foreground = extractColor(colorMatch[1]);
      }

      // Check inline background
      const bgMatch = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
      if (bgMatch) {
        background = extractColor(bgMatch[1]);
      }

      // Check class-based styles (basic extraction)
      const classes = $element.attr('class') || '';
      
      // Common patterns
      if (classes.includes('text-white') || classes.includes('text-light')) {
        foreground = foreground || '#ffffff';
      }
      if (classes.includes('text-black') || classes.includes('text-dark')) {
        foreground = foreground || '#000000';
      }
      if (classes.includes('bg-white')) {
        background = background || '#ffffff';
      }
      if (classes.includes('bg-black') || classes.includes('bg-dark')) {
        background = background || '#000000';
      }

      // Default to common webpage colors if not specified
      if (!foreground) foreground = '#000000'; // Default text color
      if (!background) {
        // Try to get from parent
        let $parent = $element.parent();
        let parentBg: string | null = null;
        
        while ($parent.length && !parentBg) {
          const parentStyle = $parent.attr('style') || '';
          const parentBgMatch = parentStyle.match(/background(?:-color)?\s*:\s*([^;]+)/i);
          if (parentBgMatch) {
            parentBg = extractColor(parentBgMatch[1]);
          }
          $parent = $parent.parent();
        }
        
        background = parentBg || '#ffffff'; // Default background
      }

      if (foreground && background) {
        const pairKey = `${foreground}-${background}`;
        
        if (!seenPairs.has(pairKey)) {
          seenPairs.add(pairKey);
          
          const ratio = calculateContrast(foreground, background);
          const wcagAA = ratio >= 4.5;
          const wcagAAA = ratio >= 7;

          // Get selector for the element
          let selector = tagName;
          const id = $element.attr('id');
          const classList = $element.attr('class');
          
          if (id) {
            selector = `#${id}`;
          } else if (classList) {
            selector = `${tagName}.${classList.split(' ')[0]}`;
          }

          colorPairs.push({
            foreground,
            background,
            contrastRatio: ratio,
            wcagAA,
            wcagAAA,
            element: tagName,
            selector,
          });
        }
      }
    });

    // Sort by contrast ratio (lowest first - most problematic)
    colorPairs.sort((a, b) => a.contrastRatio - b.contrastRatio);

    const passed = colorPairs.filter(p => p.wcagAA).length;
    const failed = colorPairs.filter(p => !p.wcagAA).length;

    const report: ContrastReport = {
      url,
      totalPairs: colorPairs.length,
      passed,
      failed,
      colorPairs,
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(report);
    
  } catch (error: any) {
    console.error('Error analyzing URL:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze URL',
      details: error.message 
    });
  }
}
