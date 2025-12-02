# Copilot Instructions for ScandicWellness Chatbot

## Project Overview

This is a standalone Swedish-language chatbot web application for ScandicWellness that provides customers with quick guidance about vitamins and supplements.

## Tech Stack

- Plain HTML, CSS, and JavaScript (no build tools or frameworks)
- No package manager or dependencies required
- Static files can be served directly or via a simple HTTP server

## Running the Application

Open `index.html` directly in a browser, or start a local server:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

## Code Style and Conventions

- Use Swedish for user-facing text and documentation
- Use English for code identifiers (variable names, function names)
- Follow existing code patterns in the repository
- Use descriptive function and variable names
- Maintain accessibility attributes in HTML (e.g., `aria-live`, `aria-label`)
- Use CSS custom properties (CSS variables) defined in `:root`

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - All styling using CSS custom properties
- `script.js` - Chatbot logic, product catalog, and knowledge base

## Key Components

### Product Catalog
Products are defined in the `productCatalog` array with name, tags, description, usage, price, and benefits.

### Knowledge Base
Common Q&A responses are stored in `knowledgeBase` with trigger words and response functions.

### UI Patterns
- BEM-style CSS class naming (e.g., `.chat__messages`, `.message--bot`)
- Messages displayed with author type and timestamp
- Quick suggestion buttons for common queries

## Testing

This project has no automated testing infrastructure. Manually verify changes by:
1. Opening `index.html` in a browser
2. Testing chatbot responses for various inputs
3. Checking responsive layout at different viewport sizes

## Contribution Guidelines

- Keep the application simple and dependency-free
- Ensure all user-facing text remains in Swedish
- Maintain accessibility standards
- Test changes across different browsers
