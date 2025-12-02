// AI Product Description Generator PRO - Content Script

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_PRODUCT_INFO') {
    const productInfo = extractProductInfo();
    sendResponse(productInfo);
  }
  return true;
});

// Extract product information from the current page
function extractProductInfo() {
  const info = {
    title: '',
    keywords: [],
    images: []
  };

  // Try different selectors for product title
  const titleSelectors = [
    'h1.product-title',
    'h1.product-single__title',
    'h1[itemprop="name"]',
    '.product_title',
    '.product-name h1',
    'h1'
  ];

  for (const selector of titleSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      info.title = element.textContent.trim();
      break;
    }
  }

  // Extract keywords from meta tags
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    info.keywords = metaKeywords.content.split(',').map(k => k.trim()).filter(k => k);
  }

  // Extract keywords from product tags/categories
  const tagSelectors = [
    '.product-tags a',
    '.product-type',
    '.product-vendor',
    '.breadcrumb a'
  ];

  for (const selector of tagSelectors) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      const text = el.textContent.trim();
      if (text && !info.keywords.includes(text)) {
        info.keywords.push(text);
      }
    });
  }

  // Extract product images
  const imageSelectors = [
    '.product-image img',
    '.product-single__photo img',
    '[itemprop="image"]',
    '.gallery-image img',
    '.product-gallery img'
  ];

  for (const selector of imageSelectors) {
    const images = document.querySelectorAll(selector);
    images.forEach(img => {
      const src = img.src || img.dataset.src || img.dataset.largeSrc;
      if (src && !info.images.includes(src)) {
        info.images.push(src);
      }
    });
  }

  return info;
}

// Inject generate button on supported e-commerce platforms
function injectGenerateButton() {
  // Check if we're on a product page
  const isProductPage = 
    window.location.pathname.includes('/products/') ||
    window.location.pathname.includes('/product/') ||
    document.querySelector('[itemtype*="Product"]');

  if (!isProductPage) return;

  // Find product form or description area
  const targetSelectors = [
    '.product-form',
    '.product-single__form',
    '.product-description',
    '.product__description'
  ];

  let targetElement = null;
  for (const selector of targetSelectors) {
    targetElement = document.querySelector(selector);
    if (targetElement) break;
  }

  if (!targetElement) return;

  // Create generate button
  const button = document.createElement('button');
  button.id = 'ai-generate-btn';
  button.innerHTML = '✨ Generera AI-text';
  button.style.cssText = `
    background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin: 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-1px)';
    button.style.boxShadow = '0 4px 12px rgba(30, 58, 138, 0.3)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'none';
    button.style.boxShadow = 'none';
  });

  button.addEventListener('click', (e) => {
    e.preventDefault();
    // Open extension popup or show inline generator
    chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
  });

  // Insert button
  targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
}

// Run injection when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectGenerateButton);
} else {
  injectGenerateButton();
}

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { extractProductInfo };
}
