# E-Commerce Front-End Scaffold Plan for SCRUM-1

## Files to Create/Modify
- **SCAFFOLD/data.json**: JSON array of 12 mock products (categories: Electronics, Clothing, Books, Home; variants: size/color; multiple images, price range $10-500).
- **SCAFFOLD/index.html**: Product listing page - grid layout, search bar, category filters.
- **SCAFFOLD/product.html**: Product detail page - image gallery, variants selectors, add-to-cart.
- **SCAFFOLD/cart.html**: Shopping cart - items list, qty controls, subtotal, remove, proceed to checkout.
- **SCAFFOLD/checkout.html**: Checkout form - shipping/payment fields, cart summary, place order (simulate).
- **SCAFFOLD/styles.css**: Global responsive styles (mobile-first, grid/flex, no frameworks).
- **SCAFFOLD/script.js**: Core logic - load data.json, cart ops (localStorage), page-specific rendering, filters/search.
- **SCAFFOLD/images/**: Folder for product images (use placeholders/URLs).

## High-Level Steps & Dependencies
1. **Data Prep** (dep: none): Generate data.json with 12 full products.
2. **HTML Structures** (dep: data.json): Build pages linking &lt;link&gt; styles.css, &lt;script defer&gt; script.js.
3. **CSS Styling** (dep: HTML): Mobile-first responsive design for all components.
4. **JS Implementation** (dep: all above): Shared utils (load data/cart), page init functions.
5. **Integration** (dep: all): Ensure nav/query params, localStorage persistence across pages.

**Notes**: Vanilla only. Responsive. Deployable static site. Full mock data, no placeholders. plan.md created on branch SCRUM-1.