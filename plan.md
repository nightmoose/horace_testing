# E-Commerce Site Development Plan

## Overview
**User Story**: As a customer, I want to browse products, add items to cart, and complete checkout so I can purchase online.

**Goal**: Build a fully functional, static e-commerce prototype using vanilla HTML/CSS/JS. No frameworks (e.g., React/Vue). Mobile-first responsive design. Use localStorage for cart persistence. Deploy to Vercel or Netlify.

**Key Deliverables**:
- Files: `index.html`, `product.html`, `cart.html`, `checkout.html`, `styles.css`, `script.js`
- Minimum 10 sample products across categories (e.g., Electronics, Clothing, Books, Home) and price ranges ($5–$500).
- All acceptance criteria met.

**Estimated Effort**: 8–12 hours (solo developer).

**Tech Stack**:
- HTML5 (semantic)
- CSS3 (Grid/Flexbox, mobile-first media queries)
- Vanilla JS (ES6+, localStorage, dynamic rendering)
- Sample data: Hardcoded products array in `script.js`.

**Assumptions**:
- No real payments/backend (checkout placeholder).
- Product details loaded via URL params (e.g., `product.html?id=1`).
- Navigation: Header links to Home/Cart/Checkout.
- Images: Use placeholders (Unsplash/Pixabay) or SVGs.

## Phase 1: Setup & Data Preparation (30–45 mins)
1. **Project Structure**:
   ```
   ecommerce-site/
   ├── index.html          # Product listing
   ├── product.html        # Product detail
   ├── cart.html           # Shopping cart
   ├── checkout.html       # Checkout
   ├── styles.css          # Global styles
   ├── script.js           # Shared logic (products data, cart, utils)
   ├── images/             # Product images (10+)
   └── README.md           # Deployment instructions
   ```
2. **Sample Products Data** (in `script.js`):
   - Array of 10+ objects: `{ id, name, category, price, images[], variants: [{size/color, stock}] }`.
   - Categories: Electronics (3), Clothing (3), Books (2), Home (2).
   - Price ranges: Low ($5–$50), Mid ($50–$200), High ($200+).
   - Example:
     ```js
     const products = [
       { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 99.99, images: ['img1.jpg'], variants: [{ size: 'M', color: 'Black' }] },
       // ... 9 more
     ];
     ```
3. **Git Init**: `git init`, initial commit.
4. **Basic HTML Boilerplate**: Add `<link rel="stylesheet" href="styles.css">` and `<script src="script.js" defer></script>` to all HTML files.

## Phase 2: Core Layout & Styling (1–2 hours)
1. **Global Styles (`styles.css`)**:
   - Reset/normalize.
   - Mobile-first: Base styles for mobile (320px+), media queries for tablet (768px+), desktop (1024px+).
   - Header: Logo, nav (Home, Cart icon with badge, Checkout).
   - Footer: Basic.
   - Components: Grid layout (CSS Grid), buttons, forms, cards.
   - Responsive: Flexbox for nav/forms, grid for product list.
2. **Shared Components**:
   - Header with cart count (JS-updated).
   - Product card: Image, name, price, "View Details" button.

## Phase 3: Page Development (3–4 hours)
Build pages sequentially, testing incrementally.

### 3.1 Product Listing (`index.html`) (45 mins)
- **HTML**: Header, search input, category filters (dropdown/select), product grid container.
- **CSS**: Grid (3-col desktop, 2-col tablet, 1-col mobile).
- **JS**:
  - Render products from `products` array.
  - Search: Filter by name (real-time input event).
  - Filters: By category (dropdown change event).
  - Link to detail: `<a href="product.html?id=${product.id}">`.

### 3.2 Product Detail (`product.html`) (1 hour)
- **HTML**: Header, image gallery (thumbnails/main), variant selectors (size/color dropdowns), price, description, "Add to Cart" button, back button.
- **CSS**: Image carousel (simple JS slider or CSS-only), variant selectors.
- **JS**:
  - Parse `URLSearchParams` for `id`.
  - Load product by ID, render details/images/variants.
  - Variant selection updates price/stock.
  - Add to cart: `localStorage.setItem('cart', JSON.stringify([...]))`, update cart count.

### 3.3 Shopping Cart (`cart.html`) (45 mins)
- **HTML**: Header, cart items list (image, name, qty input, price, remove btn), subtotal, "Proceed to Checkout" btn.
- **CSS**: Table-like or card grid.
- **JS**:
  - Load cart from localStorage.
  - Render items, qty change (update subtotal), remove item.
  - Subtotal calc: `reduce((sum, item) => sum + (item.price * item.qty), 0)`.
  - Empty cart handling.

### 3.4 Checkout (`checkout.html`) (45 mins)
- **HTML**: Header, order summary (from cart), shipping form (name, address, etc.), payment method select (Credit/Placeholder), "Place Order" btn (alert/success message).
- **CSS**: Form grid, summary sidebar.
- **JS**:
  - Load cart for summary/subtotal.
  - Form validation (basic: required fields).
  - On submit: Clear cart, show success modal/alert.
  - No real payment (placeholder options).

## Phase 4: JavaScript Integration & Polish (1–2 hours)
1. **Shared `script.js`**:
   - Products data.
   - Cart functions: `addToCart(item)`, `updateCart(id, qty)`, `removeFromCart(id)`, `getCartCount()`.
   - localStorage helpers: `getCart()`, `saveCart(cart)`.
   - Init functions: `initPage()` called on DOMContentLoaded.
   - Cart badge update across pages.
2. **Navigation**:
   - Links: Home (`index.html`), Cart (`cart.html`), Checkout from cart.
   - Cart count in header (querySelector + update).
3. **Edge Cases**:
   - No products matching search/filter.
   - Out-of-stock variants.
   - Persistent cart across pages/sessions.

## Phase 5: Testing (30–45 mins)
| Test Case | Expected |
|-----------|----------|
| Browse: Grid renders 10+ products, search/filter works | Products filter correctly, responsive grid |
| Detail: Load by ID, variants change, add to cart | Item added to localStorage, count updates |
| Cart: Add/remove/update qty, subtotal | Persists, calculations correct |
| Checkout: Form submit, summary from cart | Success message, cart clears |
| Responsive: Mobile/Tablet/Desktop | Layouts adapt (Chrome DevTools) |
| Edge: Empty cart, invalid ID, no JS | Graceful fallbacks |
| Cross-browser: Chrome/Firefox/Safari | No errors |
| Performance: Page load <2s | Minify CSS/JS if needed |

- Manual: Full user flow (browse → detail → cart → checkout).
- Console: No errors.

## Phase 6: Deployment (15 mins)
1. **Build**: Minify CSS/JS (optional: online tools).
2. **Vercel/Netlify**:
   - Drag-drop folder or `git push` to GitHub → connect.
   - Custom domain optional.
3. **README.md**:
   - Setup, demo flow, deployment steps, product data notes.

## Risks & Mitigations
- **Time overrun**: Prioritize core flow (listing/cart/checkout), defer fancy image sliders.
- **JS Bugs**: Test localStorage in incognito.
- **Images**: Download 20+ free placeholders, optimize (<100KB each).
- **No Frameworks**: If stuck on dynamic rendering, use `document.createElement` loops.

## Success Criteria
- All AC met.
- Live demo URL.
- 100% test pass.
- Clean, semantic code (commented). 

**Next Steps**: Start Phase 1. Track in Jira/Todo. Commit per phase.