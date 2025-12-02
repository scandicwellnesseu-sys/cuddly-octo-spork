// AI Product Description Generator PRO - Background Service Worker

const API_BASE_URL = 'https://api.ai-product-description.pro';

// Context menu for quick text generation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'generate-description',
    title: 'Generera produkttext för markerad text',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'generate-description') {
    const selectedText = info.selectionText;
    
    // Get auth token
    const { authToken } = await chrome.storage.local.get('authToken');
    
    if (!authToken) {
      // Open login
      chrome.tabs.create({
        url: `${API_BASE_URL.replace('api.', '')}/login?extension=true`
      });
      return;
    }
    
    // Generate description for selected text
    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: selectedText,
          keywords: [],
          language: 'SV',
          imageUrls: []
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Send result to content script to display
        chrome.tabs.sendMessage(tab.id, {
          type: 'SHOW_GENERATED_TEXT',
          data: {
            title: selectedText,
            description: data.description,
            seoScore: data.seoScore
          }
        });
      }
    } catch (error) {
      console.error('Generation failed:', error);
    }
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_POPUP') {
    // Can't programmatically open popup, but can show notification
    chrome.action.openPopup();
  }
  
  if (message.type === 'AUTH_TOKEN') {
    // Store auth token received from login page
    chrome.storage.local.set({ authToken: message.token });
    
    // Notify popup
    chrome.runtime.sendMessage({
      type: 'AUTH_SUCCESS',
      token: message.token
    });
  }
  
  return true;
});

// Handle extension install/update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open welcome page
    chrome.tabs.create({
      url: `${API_BASE_URL.replace('api.', '')}/welcome?source=extension`
    });
  }
});

// Badge to show credits remaining
async function updateBadge() {
  const { credits } = await chrome.storage.local.get('credits');
  
  if (credits !== undefined) {
    const badgeText = credits > 99 ? '99+' : String(credits);
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ 
      color: credits > 10 ? '#22c55e' : credits > 0 ? '#f59e0b' : '#ef4444'
    });
  }
}

// Update badge when credits change
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.credits) {
    updateBadge();
  }
});

// Initial badge update
updateBadge();
