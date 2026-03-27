# 🎨 CONTRAST ANALYZER - Complete Setup Guide

## 📋 What You Got

A fully-functional **Color Contrast Analyzer** web application with:

✅ **Dark Theme with 4 Color Variants** (Cyber Dark, Neon Purple, Matrix Green, Sunset Orange)
✅ **URL Analysis** - Paste any website link
✅ **File Upload** - Upload HTML/CSS files  
✅ **WCAG AA/AAA Compliance Checking**
✅ **Before/After Color Preview**
✅ **Accessible Color Palette Generator**
✅ **PDF Export** - Professional reports
✅ **JSON Export** - Machine-readable data
✅ **Responsive Design** - Works on mobile/tablet/desktop
✅ **Smooth Animations** - Framer Motion powered
✅ **Production Ready** - Optimized for deployment

---

## 🚀 Quick Start (5 Minutes)

### 1. Install Node.js
If you don't have Node.js installed:
- Download from https://nodejs.org/ (get LTS version)
- Install it on your computer

### 2. Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `terminal`, press Enter
- **Linux**: Press `Ctrl + Alt + T`

### 3. Navigate to Project
```bash
cd path/to/contrast-analyzer
```

### 4. Install Dependencies
```bash
npm install
```
(This will take 2-3 minutes)

### 5. Run the App
```bash
npm run dev
```

### 6. Open Browser
Go to: **http://localhost:3000**

**That's it! 🎉 Your app is running!**

---

## 📁 Project Structure

```
contrast-analyzer/
│
├── 📄 README.md              # Full documentation
├── 📄 DEPLOYMENT.md          # Deployment guide
├── 📄 package.json           # Dependencies
│
├── 📁 app/                   # Main application
│   ├── globals.css           # Dark theme styles
│   ├── layout.tsx            # App layout
│   └── page.tsx              # Home page
│
├── 📁 components/            # React components
│   ├── InputForm.tsx         # URL/File input
│   ├── Results.tsx           # Results display
│   └── ThemeSwitcher.tsx     # Theme selector
│
├── 📁 pages/api/             # Backend API routes
│   ├── analyze-url.ts        # URL analyzer
│   └── analyze-files.ts      # File analyzer
│
├── 📁 utils/                 # Helper functions
│   ├── colorContrast.ts      # Contrast calculations
│   └── exportReport.ts       # PDF/JSON export
│
└── 📁 public/                # Static files
    ├── sample.html           # Test HTML file
    └── sample.css            # Test CSS file
```

---

## 🎯 How to Use

### Method 1: Analyze a Website URL

1. **Open the app** (http://localhost:3000)
2. **Click "Analyze URL" tab**
3. **Paste a website URL** (e.g., https://example.com)
4. **Click "🚀 Analyze Contrast"**
5. **View results:**
   - See all color pairs
   - Check pass/fail status
   - Get contrast ratios

### Method 2: Upload Files

1. **Click "Upload Files" tab**
2. **Upload HTML file** (optional)
3. **Upload CSS file** (optional)
4. **Click "🚀 Analyze Contrast"**
5. **View results**

**Test with Sample Files:**
- Sample files are in `public/sample.html` and `public/sample.css`
- They contain both good and bad contrast examples

### View Color Alternatives

1. **Click on any FAILED color pair**
2. **Modal opens showing:**
   - Original colors (before)
   - Accessible alternatives (after)
   - Side-by-side comparison
3. **See multiple solutions** that meet WCAG standards

### Export Reports

- **PDF Report**: Click "📄 Export PDF" - Professional formatted report
- **JSON Data**: Click "💾 Export JSON" - Machine-readable data

### Switch Themes

- **Top right corner**: Click theme icons
- **4 themes available:**
  - 🌙 Cyber Dark (blue-purple)
  - 💜 Neon Purple (purple-pink)
  - 🟢 Matrix Green (green-cyan)
  - 🔥 Sunset Orange (orange-yellow)

---

## 🌐 Deploy to Production

### Deploy to Vercel (FREE & EASIEST)

1. **Create GitHub account** (if you don't have one)
   - Go to https://github.com
   - Sign up for free

2. **Upload your code to GitHub:**
   ```bash
   cd contrast-analyzer
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Click "Deploy"

4. **Done!** Your site will be live at `https://your-project.vercel.app`

**Full deployment guide in DEPLOYMENT.md**

---

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  'cyber-blue': '#00d4ff',    // Change this
  'cyber-purple': '#b84fff',  // Change this
  'cyber-pink': '#ff2e97',    // Change this
}
```

### Add More Themes

Edit `components/ThemeSwitcher.tsx`:
```typescript
const themes = [
  {
    id: 'my-theme',
    name: 'My Theme',
    colors: ['#color1', '#color2', '#color3'],
    icon: '🎨'
  }
]
```

### Modify WCAG Standards

Edit `utils/colorContrast.ts`:
```typescript
export function meetsWCAG_AA(ratio: number): boolean {
  return ratio >= 4.5; // Change minimum ratio
}
```

---

## 🔧 Troubleshooting

### Port 3000 is already in use
```bash
npm run dev -- -p 3001
```
Then open: http://localhost:3001

### Installation fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
# Check for errors
npm run build
```

### Module not found errors
```bash
# Make sure all dependencies are installed
npm install
```

---

## 📊 Features Explained

### WCAG Standards
- **WCAG AA**: Minimum 4.5:1 ratio for normal text, 3:1 for large
- **WCAG AAA**: Minimum 7:1 ratio for normal text, 4.5:1 for large

### Contrast Calculation
Uses industry-standard Chroma.js library to calculate precise contrast ratios based on relative luminance.

### Color Alternative Generation
Tries multiple strategies:
1. Darken foreground color
2. Lighten foreground color  
3. Darken background color
4. Lighten background color

Returns solutions that meet WCAG AA while preserving design intent.

---

## 📝 Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Chroma.js** - Color calculations
- **Cheerio** - HTML parsing
- **jsPDF** - PDF generation
- **Axios** - HTTP requests

---

## 🎓 Learning Resources

- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Color Contrast**: https://webaim.org/articles/contrast/
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## ❓ FAQ

**Q: Can I analyze password-protected sites?**
A: No, the backend can only access publicly available pages.

**Q: How many color pairs can it analyze?**
A: Unlimited! The app will analyze all text-background combinations.

**Q: Does it work offline?**
A: File upload mode works offline. URL mode requires internet.

**Q: Can I use this for client projects?**
A: Yes! MIT License - use it however you want.

**Q: How accurate is the contrast calculation?**
A: Uses industry-standard algorithms (same as browser dev tools).

**Q: Can I add custom WCAG levels?**
A: Yes! Edit `utils/colorContrast.ts` to modify standards.

---

## 🤝 Support

Need help?
- Check README.md for full documentation
- Check DEPLOYMENT.md for deployment help
- Review the code comments
- Test with sample.html and sample.css

---

## 🎉 Next Steps

1. **Run the app locally** to test it
2. **Try the sample files** in the public folder
3. **Customize the theme** to match your brand
4. **Deploy to Vercel** to share with others
5. **Add your own features** - it's all yours!

---

**Enjoy your Color Contrast Analyzer! 🚀**

Made with ♥ for web accessibility
