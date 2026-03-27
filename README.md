# 🎨 Contrast Analyzer - WCAG Color Contrast Checker

A powerful web application for analyzing color contrast accessibility in websites. Built with Next.js, React, and Tailwind CSS with a stunning cyberpunk aesthetic.

## ✨ Features

### 🔍 Analysis Options
- **URL Analysis**: Paste any website URL to analyze its color contrast
- **File Upload**: Upload HTML and CSS files for local analysis
- **Comprehensive Scanning**: Extracts all color pairs from inline styles and CSS rules

### 📊 Detailed Reports
- **WCAG Compliance**: Checks against WCAG 2.1 AA and AAA standards
- **Color Pair Detection**: Identifies all text-to-background color combinations
- **Contrast Ratios**: Calculates precise contrast ratios for each pair
- **Pass/Fail Status**: Clear indication of which combinations meet accessibility standards

### 🎨 Color Palette Generator
- **Before/After Preview**: Visual comparison of original vs. accessible colors
- **Multiple Solutions**: Generates several accessible color alternatives
- **Maintains Design Intent**: Adjusts colors minimally while meeting standards
- **Interactive Modal**: Click any failed pair to see suggestions

### 💾 Export Capabilities
- **PDF Reports**: Professional formatted reports with color previews
- **JSON Export**: Machine-readable data for further processing
- **Downloadable Files**: One-click export of analysis results

### 🌈 Theme Switcher
- **4 Dark Themes**: Cyber Dark, Neon Purple, Matrix Green, Sunset Orange
- **Persistent Settings**: Theme preference saved to localStorage
- **Smooth Transitions**: Animated theme changes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**
```bash
cd contrast-analyzer
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 📦 Project Structure

```
contrast-analyzer/
├── app/
│   ├── globals.css          # Global styles with cyber theme
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page component
├── components/
│   ├── InputForm.tsx         # URL/File input form
│   ├── Results.tsx           # Results display with alternatives
│   └── ThemeSwitcher.tsx     # Theme selector
├── pages/api/
│   ├── analyze-url.ts        # API route for URL analysis
│   └── analyze-files.ts      # API route for file analysis
├── utils/
│   ├── colorContrast.ts      # Contrast calculation utilities
│   └── exportReport.ts       # PDF/JSON export functions
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Color Processing**: Chroma.js
- **HTML Parsing**: Cheerio
- **CSS Parsing**: CSS Parser
- **PDF Generation**: jsPDF
- **HTTP Requests**: Axios

## 🎯 How It Works

### URL Analysis
1. User enters a website URL
2. Backend fetches the HTML content
3. Cheerio parses the DOM structure
4. Extracts inline styles and CSS classes
5. Identifies all text elements with their colors
6. Calculates contrast ratios using Chroma.js
7. Returns comprehensive report

### File Analysis
1. User uploads HTML and/or CSS files
2. Backend reads file contents
3. CSS Parser extracts style rules
4. Cheerio parses HTML structure
5. Matches CSS rules to HTML elements
6. Calculates contrast ratios
7. Returns comprehensive report

### Color Alternative Generation
1. Takes failed color pair
2. Tries multiple strategies:
   - Darken foreground
   - Lighten foreground
   - Darken background
   - Lighten background
3. Finds combinations meeting WCAG AA (4.5:1)
4. Returns top alternatives

## 📋 API Endpoints

### POST `/api/analyze-url`
Analyzes a website by URL

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "totalPairs": 15,
  "passed": 12,
  "failed": 3,
  "colorPairs": [...],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST `/api/analyze-files`
Analyzes uploaded HTML/CSS files

**Request Body:**
```json
{
  "html": "<html>...</html>",
  "css": "body { color: #000; }"
}
```

**Response:** Same as analyze-url

## 🎨 Theming System

The app includes 4 pre-built dark themes:

1. **Cyber Dark**: Blue-purple gradient (default)
2. **Neon Purple**: Purple-pink gradient
3. **Matrix Green**: Green-cyan gradient
4. **Sunset Orange**: Orange-yellow gradient

Themes are implemented using CSS variables and can be easily extended.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Click "Deploy"

3. **Environment Variables** (if needed)
   - None required for basic functionality

### Deploy to Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `.next`
3. **Deploy**

## 🔧 Configuration

### Modify WCAG Standards
Edit `utils/colorContrast.ts`:
```typescript
// Change minimum contrast ratios
export function meetsWCAG_AA(ratio: number): boolean {
  return ratio >= 4.5; // Change this value
}
```

### Add More Themes
Edit `components/ThemeSwitcher.tsx`:
```typescript
const themes = [
  // Add new theme
  {
    id: 'custom-theme',
    name: 'Custom',
    colors: ['#000000', '#ffffff', '#ff0000'],
    icon: '🎨'
  }
];
```

### Customize Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'custom-color': '#hexcode',
}
```

## 📝 Future Enhancements

- [ ] Browser extension version
- [ ] Real-time preview as you type
- [ ] Batch URL analysis
- [ ] Historical report comparison
- [ ] Email report delivery
- [ ] Custom WCAG level selection
- [ ] Image color extraction
- [ ] Color blindness simulation

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use for any project!

## 🙏 Acknowledgments

- Built with accessibility in mind
- Follows WCAG 2.1 guidelines
- Inspired by the need for better web accessibility tools

---

Made with ♥ for accessibility
