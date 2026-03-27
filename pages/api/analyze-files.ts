import type { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import chroma from 'chroma-js';
import cssParser from 'css';
import { ColorPair, ContrastReport } from '@/utils/colorContrast';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { html, css } = req.body;

  if (!html && !css) {
    return res.status(400).json({ error: 'HTML or CSS content is required' });
  }

  try {
    const colorPairs: ColorPair[] = [];
    const seenPairs = new Set<string>();
    const cssRules = new Map<string, { color?: string; background?: string }>();

    // Parse CSS if provided
    if (css) {
      try {
        const ast = cssParser.parse(css, { silent: true });
        
        if (ast.stylesheet && ast.stylesheet.rules) {
          ast.stylesheet.rules.forEach((rule: any) => {
            if (rule.type === 'rule' && rule.selectors) {
              const styles: { color?: string; background?: string } = {};
              
              rule.declarations?.forEach((decl: any) => {
                if (decl.type === 'declaration') {
                  if (decl.property === 'color') {
                    styles.color = decl.value;
                  }
                  if (decl.property === 'background-color' || decl.property === 'background') {
                    styles.background = decl.value;
                  }
                }
              });
              
              rule.selectors.forEach((selector: string) => {
                cssRules.set(selector, styles);
              });
            }
          });
        }
      } catch (cssError) {
        console.error('CSS parsing error:', cssError);
      }
    }

    // Parse HTML
    const $ = cheerio.load(html || '');
    
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

    const calculateContrast = (fg: string, bg: string): number => {
      try {
        return chroma.contrast(fg, bg);
      } catch {
        return 0;
      }
    };

    // Helper to get CSS rule for element
    const getStyleForElement = ($element: cheerio.Cheerio<Element>) => {
      let styles: { color?: string; background?: string } = {};
      
      // Check by ID
      const id = $element.attr('id');
      if (id && cssRules.has(`#${id}`)) {
        const rule = cssRules.get(`#${id}`)!;
        if (rule.color) styles.color = rule.color;
        if (rule.background) styles.background = rule.background;
      }
      
      // Check by class
      const classes = ($element.attr('class') || '').split(' ');
      classes.forEach(cls => {
        if (cls && cssRules.has(`.${cls}`)) {
          const rule = cssRules.get(`.${cls}`)!;
          if (rule.color) styles.color = rule.color;
          if (rule.background) styles.background = rule.background;
        }
      });
      
      // Check by tag name
      const tag = $element[0].name;
      if (cssRules.has(tag)) {
        const rule = cssRules.get(tag)!;
        if (!styles.color && rule.color) styles.color = rule.color;
        if (!styles.background && rule.background) styles.background = rule.background;
      }
      
      return styles;
    };

    $('*').each((_, element) => {
      const $element = $(element);
      
      const text = $element.text().trim();
      if (!text || text.length === 0) return;
      
      const tagName = element.name.toLowerCase();
      if (['script', 'style', 'meta', 'link', 'noscript'].includes(tagName)) return;

      let foreground: string | null = null;
      let background: string | null = null;

      // Get inline styles
      const style = $element.attr('style') || '';
      const colorMatch = style.match(/color\s*:\s*([^;]+)/i);
      const bgMatch = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
      
      if (colorMatch) foreground = extractColor(colorMatch[1]);
      if (bgMatch) background = extractColor(bgMatch[1]);

      // Get CSS rule styles
      const cssStyles = getStyleForElement($element);
      if (!foreground && cssStyles.color) {
        foreground = extractColor(cssStyles.color);
      }
      if (!background && cssStyles.background) {
        background = extractColor(cssStyles.background);
      }

      // Defaults
      if (!foreground) foreground = '#000000';
      if (!background) {
        let $parent = $element.parent();
        let parentBg: string | null = null;
        
        while ($parent.length && !parentBg) {
          const parentStyle = $parent.attr('style') || '';
          const parentBgMatch = parentStyle.match(/background(?:-color)?\s*:\s*([^;]+)/i);
          if (parentBgMatch) {
            parentBg = extractColor(parentBgMatch[1]);
          }
          
          const parentCssStyles = getStyleForElement($parent);
          if (!parentBg && parentCssStyles.background) {
            parentBg = extractColor(parentCssStyles.background);
          }
          
          $parent = $parent.parent();
        }
        
        background = parentBg || '#ffffff';
      }

      if (foreground && background) {
        const pairKey = `${foreground}-${background}`;
        
        if (!seenPairs.has(pairKey)) {
          seenPairs.add(pairKey);
          
          const ratio = calculateContrast(foreground, background);
          const wcagAA = ratio >= 4.5;
          const wcagAAA = ratio >= 7;

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

    colorPairs.sort((a, b) => a.contrastRatio - b.contrastRatio);

    const passed = colorPairs.filter(p => p.wcagAA).length;
    const failed = colorPairs.filter(p => !p.wcagAA).length;

    const report: ContrastReport = {
      url: 'Uploaded Files',
      totalPairs: colorPairs.length,
      passed,
      failed,
      colorPairs,
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(report);
    
  } catch (error: any) {
    console.error('Error analyzing files:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze files',
      details: error.message 
    });
  }
}
