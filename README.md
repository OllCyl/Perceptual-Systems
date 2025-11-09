# IT Konsult - Professional Website

A modern, bilingual (Swedish/English) website for IT consulting services built with React, TypeScript, and Tailwind CSS.

## Features

- 🌐 **Bilingual Support**: Full Swedish and English translations
- 📱 **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- 🎨 **Modern UI**: Clean, professional design with Tailwind CSS
- 📧 **Contact Form**: Integrated contact form with honeypot spam protection
- ⚡ **Fast & Static**: Built with Vite for optimal performance
- 🚀 **GitHub Pages Ready**: Easy deployment to GitHub Pages

## Pages

- **Home**: Hero section with call-to-action and key features
- **Services**: Showcase of products and consulting services (Visare, mapongo, Consulting)
- **About**: Professional background and experience
- **Contact**: Contact form with spam protection and contact information

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd oll3
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Deployment to GitHub Pages

### Option 1: Using gh-pages package (Included)

1. Update `vite.config.ts` with your repository name:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Change this to your repo name
})
```

2. Deploy:
```bash
npm run deploy
```

### Option 2: GitHub Actions (Recommended)

1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v2
        id: deployment
```

2. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

## Custom Domain

To use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain name
2. Configure DNS settings:
   - For apex domain (example.com): Add A records pointing to GitHub's IPs
   - For subdomain (www.example.com): Add CNAME record pointing to `<username>.github.io`

## Contact Form Integration

The contact form currently simulates submission. To enable real email sending:

### reCAPTCHA Setup (Required)

The contact form uses Google reCAPTCHA v2 for spam protection. The email address is also hidden until the CAPTCHA is solved.

1. Get your reCAPTCHA keys at [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
2. Choose reCAPTCHA v2 "I'm not a robot" Checkbox
3. Update `src/pages/Contact.tsx` line 166 with your site key:
```typescript
sitekey="YOUR_SITE_KEY_HERE"
```

**Note**: The current key `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` is Google's test key that always passes. Replace it with your production key.

### Using Formspree

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form and get your form ID
3. Update `src/pages/Contact.tsx`:
```typescript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    company: formData.company,
    message: formData.message,
  }),
})
```

### Using Netlify Forms

If deploying to Netlify, add `netlify` attribute to the form tag.

## Customization

### Update Content

All text content is in `src/context/LanguageContext.tsx`. Update the translations object to change text.

### Update Colors

Modify `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: {
    // Your custom colors
  },
}
```

### Add/Remove Pages

1. Create new page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Navigation.tsx`
4. Add translations in `src/context/LanguageContext.tsx`

## Security

- **Google reCAPTCHA v2** - Required to submit form and view email address
- **Honeypot field** - Additional spam protection
- **Client-side form validation** - Input validation before submission
- **Email address protection** - Email hidden until CAPTCHA is solved, preventing scraping

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private project - All rights reserved

## Contact

For questions or support, use the contact form on the website.
