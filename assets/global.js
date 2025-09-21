// Global JavaScript for Supplements Strong Theme

class SupplementsTheme {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupProductVariants();
    this.setupCartFunctionality();
    this.setupSearchFunctionality();
    this.setupScrollEffects();
    this.setupAccessibility();
  }

  setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    
    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.toggleAttribute('hidden');
        document.body.classList.toggle('mobile-menu-open');
      });
    }
  }

  setupProductVariants() {
    const variantSelects = document.querySelectorAll('[data-variant-select]');
    
    variantSelects.forEach(select => {
      select.addEventListener('change', (e) => {
        this.updateProductVariant(e.target);
      });
    });
  }

  updateProductVariant(select) {
    const productForm = select.closest('[data-product-form]');
    if (!productForm) return;

    const variantId = select.value;
    const productData = JSON.parse(productForm.querySelector('[data-product-json]').textContent);
    const variant = productData.variants.find(v => v.id == variantId);

    if (variant) {
      this.updatePrice(productForm, variant);
      this.updateAvailability(productForm, variant);
      this.updateProductImages(productForm, variant);
    }
  }

  updatePrice(form, variant) {
    const priceElement = form.querySelector('[data-price]');
    const comparePriceElement = form.querySelector('[data-compare-price]');
    
    if (priceElement) {
      priceElement.textContent = this.formatMoney(variant.price);
    }
    
    if (comparePriceElement) {
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        comparePriceElement.textContent = this.formatMoney(variant.compare_at_price);
        comparePriceElement.style.display = 'inline';
      } else {
        comparePriceElement.style.display = 'none';
      }
    }
  }

  updateAvailability(form, variant) {
    const addToCartButton = form.querySelector('[data-add-to-cart]');
    const availabilityText = form.querySelector('[data-availability-text]');
    
    if (addToCartButton) {
      if (variant.available) {
        addToCartButton.disabled = false;
        addToCartButton.textContent = window.variantStrings.addToCart || 'Add to cart';
      } else {
        addToCartButton.disabled = true;
        addToCartButton.textContent = window.variantStrings.soldOut || 'Sold out';
      }
    }
    
    if (availabilityText) {
      availabilityText.textContent = variant.available ? 'In stock' : 'Out of stock';
      availabilityText.className = variant.available ? 'availability-in-stock' : 'availability-out-of-stock';
    }
  }

  updateProductImages(form, variant) {
    if (!variant.featured_image) return;
    
    const mainImage = form.closest('.product').querySelector('[data-main-image]');
    if (mainImage) {
      mainImage.src = variant.featured_image.src;
      mainImage.alt = variant.featured_image.alt || variant.name;
    }
  }

  setupCartFunctionality() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-add-to-cart]')) {
        e.preventDefault();
        this.addToCart(e.target);
      }
      
      if (e.target.matches('[data-cart-remove]')) {
        e.preventDefault();
        this.removeFromCart(e.target);
      }
    });
  }

  async addToCart(button) {
    const form = button.closest('form');
    const formData = new FormData(form);
    
    button.classList.add('loading');
    button.disabled = true;
    
    try {
      const response = await fetch(window.routes.cart_add_url, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        this.updateCartCount();
        this.showCartNotification(data);
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      this.showError('Unable to add item to cart. Please try again.');
    } finally {
      button.classList.remove('loading');
      button.disabled = false;
    }
  }

  async removeFromCart(button) {
    const lineItem = button.closest('[data-line-item]');
    const variantId = button.dataset.variantId;
    
    try {
      const response = await fetch(window.routes.cart_change_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: 0
        })
      });
      
      if (response.ok) {
        lineItem.remove();
        this.updateCartCount();
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      this.showError('Unable to remove item from cart. Please try again.');
    }
  }

  async updateCartCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      
      const cartCountElements = document.querySelectorAll('[data-cart-count]');
      cartCountElements.forEach(element => {
        element.textContent = cart.item_count;
      });
    } catch (error) {
      console.error('Update cart count error:', error);
    }
  }

  showCartNotification(item) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="cart-notification-content">
        <p>Added to cart: ${item.product_title}</p>
        <button type="button" class="cart-notification-close" aria-label="Close">&times;</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    const closeBtn = notification.querySelector('.cart-notification-close');
    closeBtn.addEventListener('click', () => {
      this.hideCartNotification(notification);
    });
    
    setTimeout(() => {
      this.hideCartNotification(notification);
    }, 3000);
  }

  hideCartNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  showError(message) {
    const error = document.createElement('div');
    error.className = 'error-notification';
    error.textContent = message;
    
    document.body.appendChild(error);
    
    setTimeout(() => {
      error.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      error.classList.remove('show');
      setTimeout(() => {
        if (error.parentNode) {
          error.parentNode.removeChild(error);
        }
      }, 300);
    }, 3000);
  }

  setupSearchFunctionality() {
    const searchInput = document.querySelector('[data-search-input]');
    const searchResults = document.querySelector('[data-search-results]');
    
    if (searchInput && searchResults) {
      let searchTimeout;
      
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length < 3) {
          searchResults.innerHTML = '';
          searchResults.hidden = true;
          return;
        }
        
        searchTimeout = setTimeout(() => {
          this.performSearch(query, searchResults);
        }, 300);
      });
    }
  }

  async performSearch(query, resultsContainer) {
    try {
      const response = await fetch(`${window.routes.predictive_search_url}?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`);
      const data = await response.json();
      
      this.displaySearchResults(data.resources.products, resultsContainer);
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  displaySearchResults(products, container) {
    if (!products.length) {
      container.innerHTML = '<p>No products found</p>';
      container.hidden = false;
      return;
    }
    
    const resultsHTML = products.map(product => `
      <div class="search-result">
        <a href="${product.url}">
          <img src="${product.featured_image?.url}" alt="${product.title}" loading="lazy">
          <div>
            <h4>${product.title}</h4>
            <p class="price">${this.formatMoney(product.price)}</p>
          </div>
        </a>
      </div>
    `).join('');
    
    container.innerHTML = resultsHTML;
    container.hidden = false;
  }

  setupScrollEffects() {
    const header = document.querySelector('[data-header]');
    
    if (header && window.innerWidth > 768) {
      let lastScrollTop = 0;
      
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }
        
        lastScrollTop = scrollTop;
      });
    }
  }

  setupAccessibility() {
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModals();
        this.closeMobileMenu();
      }
    });
    
    // Skip links functionality
    const skipLinks = document.querySelectorAll('.skip-to-content-link');
    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView();
        }
      });
    });
  }

  closeModals() {
    const modals = document.querySelectorAll('[data-modal][open]');
    modals.forEach(modal => {
      modal.close();
    });
  }

  closeMobileMenu() {
    const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    
    if (mobileMenuToggle && mobileMenu && !mobileMenu.hidden) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
      document.body.classList.remove('mobile-menu-open');
    }
  }

  formatMoney(cents) {
    const money = (cents / 100).toFixed(2);
    return `$${money}`;
  }
}

// Initialize theme functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SupplementsTheme();
});

// Export for potential external use
window.SupplementsTheme = SupplementsTheme;