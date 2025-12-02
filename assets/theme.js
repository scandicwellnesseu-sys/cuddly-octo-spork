/**
 * Shopify Theme JavaScript
 * Adapted from the original script.js with Shopify-specific functionality
 */

// Mobile Navigation
function initMobileNav() {
  const toggle = document.querySelector('.site-header__toggle');
  const nav = document.querySelector('#primary-nav');

  if (!toggle || !nav) return;

  function openNav() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function toggleNav() {
    if (nav.classList.contains('is-open')) {
      closeNav();
    } else {
      openNav();
    }
  }

  toggle.addEventListener('click', toggleNav);

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
    }
  });

  // Close when clicking outside
  document.addEventListener('click', function(e) {
    if (nav.classList.contains('is-open') && 
        !nav.contains(e.target) && 
        !toggle.contains(e.target)) {
      closeNav();
    }
  });
}

// Update year in footer
function updateYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Contact Form Validation
function validateForm(form) {
  const nameInput = form.querySelector('#ContactForm-name');
  const emailInput = form.querySelector('#ContactForm-email');
  const messageInput = form.querySelector('#ContactForm-message');
  const websiteInput = form.querySelector('#ContactForm-website');

  let isValid = true;

  // Check honeypot field (anti-spam)
  if (websiteInput && websiteInput.value !== '') {
    return false;
  }

  // Validate name
  if (nameInput && !nameInput.value.trim()) {
    isValid = false;
    nameInput.setAttribute('aria-invalid', 'true');
  } else if (nameInput) {
    nameInput.setAttribute('aria-invalid', 'false');
  }

  // Validate email
  if (emailInput) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      isValid = false;
      emailInput.setAttribute('aria-invalid', 'true');
    } else {
      emailInput.setAttribute('aria-invalid', 'false');
    }
  }

  // Validate message
  if (messageInput && !messageInput.value.trim()) {
    isValid = false;
    messageInput.setAttribute('aria-invalid', 'true');
  } else if (messageInput) {
    messageInput.setAttribute('aria-invalid', 'false');
  }

  return isValid;
}

function initForm() {
  const contactForm = document.querySelector('[data-contact-form]');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    if (!validateForm(contactForm)) {
      e.preventDefault();
      
      // Scroll to first error
      const firstError = contactForm.querySelector('[aria-invalid="true"]');
      if (firstError) {
        firstError.focus();
      }
    }
  });

  // Clear aria-invalid on input
  const formInputs = contactForm.querySelectorAll('input, textarea');
  formInputs.forEach(input => {
    input.addEventListener('input', function() {
      this.setAttribute('aria-invalid', 'false');
    });
  });
}

// Add to Cart functionality
function initAddToCart() {
  // Handle product card quick add to cart
  document.addEventListener('click', function(e) {
    const addToCartButton = e.target.closest('.product-card__add-to-cart');
    if (!addToCartButton || addToCartButton.disabled) return;

    e.preventDefault();
    
    const variantId = addToCartButton.dataset.variantId;
    const productId = addToCartButton.dataset.productId;

    if (!variantId) return;

    const formData = {
      items: [{
        id: variantId,
        quantity: 1
      }]
    };

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Update cart count
      updateCartCount();
      
      // Show success message
      showNotification('Product added to cart!');
      
      // Optional: Open cart drawer or redirect
      // window.location.href = '/cart';
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      showNotification('Error adding product to cart', 'error');
    });
  });

  // Handle product form submission via AJAX
  const productForms = document.querySelectorAll('[data-type="add-to-cart-form"]');
  productForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(form);
      const addButton = form.querySelector('[data-add-to-cart-button]');
      
      if (addButton) {
        addButton.disabled = true;
        const originalText = addButton.querySelector('[data-add-to-cart-text]').textContent;
        addButton.querySelector('[data-add-to-cart-text]').textContent = 'Adding...';

        fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          updateCartCount();
          showNotification('Product added to cart!');
          
          // Reset button
          addButton.disabled = false;
          addButton.querySelector('[data-add-to-cart-text]').textContent = originalText;
        })
        .catch(error => {
          console.error('Error:', error);
          showNotification('Error adding product to cart', 'error');
          
          // Reset button
          addButton.disabled = false;
          addButton.querySelector('[data-add-to-cart-text]').textContent = originalText;
          
          // Show error message
          const errorWrapper = form.querySelector('.product-form__error-message-wrapper');
          const errorMessage = form.querySelector('.product-form__error-message');
          if (errorWrapper && errorMessage) {
            errorMessage.textContent = 'Unable to add product to cart. Please try again.';
            errorWrapper.hidden = false;
          }
        });
      }
    });
  });
}

// Update cart count
function updateCartCount() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(data => {
      const cartCountElement = document.getElementById('cart-count');
      if (cartCountElement) {
        cartCountElement.textContent = data.item_count;
      }
    })
    .catch(error => {
      console.error('Error updating cart count:', error);
    });
}

// Show notification
function showNotification(message, type = 'success') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
    color: ${type === 'success' ? '#155724' : '#721c24'};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// FAQ Accordion functionality (if needed for future sections)
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('[data-faq-item]');
  
  faqItems.forEach(item => {
    const button = item.querySelector('[data-faq-button]');
    const content = item.querySelector('[data-faq-content]');
    
    if (!button || !content) return;

    button.addEventListener('click', function() {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      // Close all other items
      faqItems.forEach(otherItem => {
        const otherButton = otherItem.querySelector('[data-faq-button]');
        const otherContent = otherItem.querySelector('[data-faq-content]');
        if (otherButton && otherContent && otherItem !== item) {
          otherButton.setAttribute('aria-expanded', 'false');
          otherContent.hidden = true;
        }
      });
      
      // Toggle current item
      button.setAttribute('aria-expanded', !isExpanded);
      content.hidden = isExpanded;
    });
  });
}

// Initialize all functionality
function init() {
  updateYear();
  initMobileNav();
  initForm();
  initAddToCart();
  initFaqAccordion();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
