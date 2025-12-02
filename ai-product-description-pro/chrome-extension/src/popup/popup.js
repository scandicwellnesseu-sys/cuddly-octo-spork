// AI Product Description Generator PRO - Chrome Extension Popup

const API_BASE_URL = 'https://api.ai-product-description.pro';

// DOM Elements
const loginView = document.getElementById('login-view');
const mainView = document.getElementById('main-view');
const loginBtn = document.getElementById('login-btn');
const generateForm = document.getElementById('generate-form');
const generateBtn = document.getElementById('generate-btn');
const loader = document.getElementById('loader');
const resultSection = document.getElementById('result-section');
const resultText = document.getElementById('result-text');
const seoScore = document.getElementById('seo-score');
const copyBtn = document.getElementById('copy-btn');
const creditsCount = document.getElementById('credits-count');

// State
let authToken = null;
let currentResult = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Check for stored auth token
  const stored = await chrome.storage.local.get(['authToken', 'credits']);
  
  if (stored.authToken) {
    authToken = stored.authToken;
    showMainView();
    if (stored.credits) {
      updateCreditsDisplay(stored.credits);
    }
    fetchUserData();
  } else {
    showLoginView();
  }
  
  // Try to get product info from current page
  tryGetPageProductInfo();
});

// Event Listeners
loginBtn.addEventListener('click', handleLogin);
generateForm.addEventListener('submit', handleGenerate);
copyBtn.addEventListener('click', handleCopy);

// Functions
function showLoginView() {
  loginView.classList.remove('hidden');
  mainView.classList.add('hidden');
}

function showMainView() {
  loginView.classList.add('hidden');
  mainView.classList.remove('hidden');
}

function updateCreditsDisplay(credits) {
  creditsCount.textContent = `${credits} krediter kvar`;
}

async function handleLogin() {
  // Open login page in new tab
  chrome.tabs.create({
    url: `${API_BASE_URL.replace('api.', '')}/login?extension=true`
  });
  
  // Listen for auth token from background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'AUTH_SUCCESS') {
      authToken = message.token;
      chrome.storage.local.set({ authToken: message.token });
      showMainView();
      fetchUserData();
    }
  });
}

async function fetchUserData() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      updateCreditsDisplay(data.organization?.creditsBalance || 0);
      chrome.storage.local.set({ credits: data.organization?.creditsBalance || 0 });
    } else if (response.status === 401) {
      // Token expired, show login
      authToken = null;
      chrome.storage.local.remove('authToken');
      showLoginView();
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
}

async function handleGenerate(e) {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const keywords = document.getElementById('keywords').value
    .split(',')
    .map(k => k.trim())
    .filter(k => k);
  const language = document.getElementById('language').value;
  
  // Show loader
  generateBtn.disabled = true;
  loader.classList.add('active');
  resultSection.classList.add('hidden');
  
  try {
    const response = await fetch(`${API_BASE_URL}/ai/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        keywords,
        language,
        imageUrls: []
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      currentResult = data;
      displayResult(data);
      
      // Update credits
      const credits = await chrome.storage.local.get('credits');
      const newCredits = (credits.credits || 0) - 1;
      chrome.storage.local.set({ credits: newCredits });
      updateCreditsDisplay(newCredits);
    } else {
      const error = await response.json();
      alert(error.message || 'Något gick fel. Försök igen.');
    }
  } catch (error) {
    console.error('Generation failed:', error);
    alert('Kunde inte ansluta till servern. Försök igen.');
  } finally {
    generateBtn.disabled = false;
    loader.classList.remove('active');
  }
}

function displayResult(data) {
  resultText.textContent = data.description;
  
  // Update SEO score badge
  const score = data.seoScore || 0;
  seoScore.textContent = `SEO: ${score}`;
  seoScore.className = 'seo-score';
  if (score >= 80) {
    seoScore.classList.add('high');
  } else if (score >= 60) {
    seoScore.classList.add('medium');
  } else {
    seoScore.classList.add('low');
  }
  
  resultSection.classList.remove('hidden');
}

async function handleCopy() {
  if (!currentResult) return;
  
  try {
    await navigator.clipboard.writeText(currentResult.description);
    copyBtn.textContent = '✓ Kopierad!';
    setTimeout(() => {
      copyBtn.textContent = '📋 Kopiera till urklipp';
    }, 2000);
  } catch (error) {
    console.error('Copy failed:', error);
  }
}

async function tryGetPageProductInfo() {
  // Try to get current tab and extract product info
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab) {
      chrome.tabs.sendMessage(tab.id, { type: 'GET_PRODUCT_INFO' }, (response) => {
        if (chrome.runtime.lastError) {
          // Content script not loaded or page not supported
          return;
        }
        
        if (response && response.title) {
          document.getElementById('title').value = response.title;
        }
        if (response && response.keywords) {
          document.getElementById('keywords').value = response.keywords.join(', ');
        }
      });
    }
  } catch (error) {
    console.error('Failed to get page info:', error);
  }
}
