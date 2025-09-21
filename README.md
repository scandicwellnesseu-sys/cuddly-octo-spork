# Supplements Strong Theme - Shopify Theme

A modern, responsive Shopify theme specifically designed for supplement and wellness stores. This theme focuses on trust, product information display, and conversion optimization for health and wellness e-commerce.

## Features

### 🎨 Design & User Experience
- **Mobile-first responsive design** - Optimized for all devices
- **Clean, modern aesthetics** - Professional look that builds trust
- **Accessibility focused** - WCAG compliant with proper semantic markup
- **Fast loading** - Optimized assets and minimal dependencies

### 🛍️ E-commerce Features
- **Product-focused design** - Detailed product pages with supplement facts
- **Advanced filtering** - Filter by price, availability, tags, and more
- **Quick add to cart** - Streamlined purchasing experience
- **Trust badges** - Lab tested, natural ingredients, money-back guarantee
- **Product image zoom** - Hover and click zoom options
- **Related products** - Intelligent product recommendations

### 📱 Sections & Templates
- **Hero banner** - Eye-catching homepage hero with CTAs
- **Product cards** - Rich product displays with ratings and benefits
- **Newsletter signup** - Email collection with privacy compliance
- **Announcement bar** - Promotions and important messages
- **Trust indicators** - Security and quality assurance badges

### ⚙️ Customization
- **Theme settings** - Comprehensive customization options
- **Color schemes** - Brand-aligned color customization
- **Typography** - Google Fonts integration
- **Layout options** - Flexible page width and sticky header
- **Product options** - Show/hide vendor, SKU, reviews

## Theme Structure

```
├── assets/                 # CSS, JS, and image assets
├── config/                 # Theme configuration
├── layout/                 # Theme layout files
├── locales/               # Translation files
├── sections/              # Reusable sections
├── snippets/              # Reusable code snippets
└── templates/             # Page templates
```

## Installation

### Option 1: Direct Upload
1. Download the theme files
2. Create a ZIP file of the theme folder
3. Upload to Shopify Admin → Online Store → Themes

### Option 2: Shopify CLI
```bash
# Clone the repository
git clone [repository-url]

# Navigate to theme directory
cd cuddly-octo-spork

# Install Shopify CLI if not already installed
npm install -g @shopify/cli @shopify/theme

# Connect to your store
shopify theme dev

# Push to your store
shopify theme push
```

## Development

### Prerequisites
- Shopify store (development store recommended)
- Shopify CLI
- Node.js (for development tools)

### Local Development
```bash
# Start local development server
shopify theme dev

# Push changes to store
shopify theme push

# Pull changes from store
shopify theme pull
```

### Customization Guidelines

#### Colors
Update brand colors in `config/settings_schema.json`:
- Primary Color: Main brand color for buttons and links
- Secondary Color: Complementary color for hover states
- Accent Color: Highlight color for sales and CTAs

#### Typography
Configure fonts in theme settings:
- Heading Font: For titles and headings
- Body Font: For main content text
- Font Size Base: Adjusts overall text sizing

#### Product Features
Enable/disable product features:
- Product vendor display
- SKU visibility
- Product reviews integration
- Image zoom functionality

## Supplements-Specific Features

### Supplement Facts Display
Add supplement facts using product metafields:
- `custom.supplement_facts` - HTML formatted supplement facts panel
- `custom.ingredients` - Ingredient list
- `custom.usage_instructions` - Usage directions
- `custom.key_benefits` - Comma-separated list of benefits

### Trust & Compliance
- Trust badges for lab testing, natural ingredients
- Privacy-compliant newsletter signup
- Secure checkout indicators
- Money-back guarantee displays

### SEO Optimization
- Structured data for products and organization
- Open Graph and Twitter Card meta tags
- Optimized product URLs and descriptions
- Breadcrumb navigation

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- Lazy loading for images
- Minified CSS and JavaScript
- Optimized asset delivery
- Mobile-first responsive images

## Support
For theme support and customization:
1. Check the documentation in each template file
2. Review the settings schema for customization options
3. Test changes in a development store first

## License
This theme is licensed for use with Shopify stores. Please ensure compliance with Shopify's theme development guidelines.

## Changelog

### Version 1.0.0
- Initial release
- Core theme structure
- Product and collection templates
- Responsive design implementation
- Supplements-specific features
