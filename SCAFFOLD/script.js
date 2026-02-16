'use strict';

let products = [];
let cart = [];

// Global functions for onclick in dynamic HTML
function changeQty(productId, delta) {
  let currentCart = getCart();
  const itemIndex = currentCart.findIndex(item => item.id === productId);
  if (itemIndex !== -1) {
    currentCart[itemIndex].quantity = Math.max(1, currentCart[itemIndex].quantity + delta);
    if (currentCart[itemIndex].quantity === 0) {
      currentCart.splice(itemIndex, 1);
    }
    localStorage.setItem('cart', JSON.stringify(currentCart));
    updateCartCount();
    const pageScript = document.querySelector('script[data-page]');
    if (pageScript && pageScript.dataset.page === 'cart') {
      renderCart();
    }
  }
}

function removeFromCart(productId) {
  let currentCart = getCart().filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(currentCart));
  updateCartCount();
  const pageScript = document.querySelector('script[data-page]');
  if (pageScript && pageScript.dataset.page === 'cart') {
    renderCart();
  }
}

async function init() {
  // Fallback to fetch if no data.js
  if (window.productsData) {
    products = window.productsData;
  } else {
    try {
      const response = await fetch('data.json');
      if (!response.ok) throw new Error('Fetch failed');
      products = await response.json();
    } catch (error) {
      console.error('Failed to load products:', error);
      showError('Could not load products. Please refresh.');
      return;
    }
  }
  if (products.length === 0) {
    showError('No products available.');
    return;
  }
  attachEventListeners();
  const page = document.querySelector('script[data-page]')?.dataset.page || 'index';
  switch (page) {
    case 'index':
      renderProducts(products);
      break;
    case 'product':
      renderProductDetail();
      break;
    case 'cart':
      renderCart();
      break;
    case 'checkout':
      renderCheckout();
      break;
  }
  updateCartCount();
}

function showError(message) {
  const container = document.querySelector('.container') || document.body;
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'background: var(--error-color); color: white; padding: 1rem; border-radius: 4px; margin: 1rem 0; text-align: center;';
  errorDiv.textContent = message;
  container.insertBefore(errorDiv, container.firstChild);
}

function getCart() {
  try {
    const stored = localStorage.getItem('cart') || '[]';
    return JSON.parse(stored);
  } catch (e) {
    console.error('Invalid cart data:', e);
    localStorage.removeItem('cart');
    return [];
  }
}

function filterProducts(searchTerm = '', category = 'all') {
  return products.filter(product => 
    (category === 'all' || product.category === category) &&
    (!searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
}

function renderProducts(filteredProducts) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = filteredProducts.map(product => `
    <div class="product-card">
      <img src="${product.images[0] || 'placeholder.jpg'}" alt="${product.name}">
      <h3 class="product-name"><a href="product.html?id=${product.id}" style="color: inherit; text-decoration: none;">${product.name}</a></h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <button class="btn" data-id="${product.id}">Add to Cart</button>
      <a href="product.html?id=${product.id}" class="btn btn-secondary">View Details</a>
    </div>
  `).join('');
}

function renderProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));
  const product = products.find(p => p.id === id);
  if (!product) {
    showError('Product not found.');
    return;
  }
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
  document.getElementById('product-description').textContent = `Premium ${product.category} item - ${product.name}. Fast shipping!`;
  const mainImg = document.getElementById('main-image');
  mainImg.src = product.images[0] || 'placeholder.jpg';
  mainImg.alt = product.name;
  const thumbsDiv = document.querySelector('.thumbnails');
  thumbsDiv.innerHTML = (product.images || []).slice(1).map((img, index) => 
    `<img src="${img}" alt="Thumbnail ${index + 1}" data-index="${index + 1}">`
  ).join('');
  // Attach thumbnail click events
  document.querySelectorAll('.thumbnails img').forEach((thumb, idx) => {
    thumb.style.cursor = 'pointer';
    thumb.addEventListener('click', () => {
      mainImg.src = product.images[idx + 1] || product.images[0];
    });
  });
  // Variants
  const colors = product.variants?.colors || [];
  const colorSel = document.getElementById('color-select');
  colorSel.innerHTML = colors.length ? colors.map(c => `<option value="${c}">${c}</option>`).join('') : '<option value="">No color options</option>';
  const sizes = product.variants?.sizes || [];
  const sizeSel = document.getElementById('size-select');
  sizeSel.innerHTML = sizes.length ? sizes.map(s => `<option value="${s}">${s}</option>`).join('') : '<option value="">No size options</option>';
  // Add to cart with validation
  const addBtn = document.getElementById('add-to-cart-btn');
  addBtn.onclick = () => {
    const selectedColor = colorSel.value;
    const selectedSize = sizeSel.value;
    if (colors.length && !selectedColor) {
      alert('Please select a color.');
      return;
    }
    if (sizes.length && !selectedSize) {
      alert('Please select a size.');
      return;
    }
    const variant = {};
    if (selectedColor) variant.color = selectedColor;
    if (selectedSize) variant.size = selectedSize;
    addToCart(id, variant);
  };
}

function renderCart() {
  const currentCart = getCart();
  const itemsDiv = document.getElementById('cart-items');
  const emptyDiv = document.getElementById('cart-empty');
  const totalDiv = document.getElementById('cart-total');
  const totalSpan = document.getElementById('total-amount');
  if (!itemsDiv || !emptyDiv || !totalDiv) return;
  if (currentCart.length === 0) {
    itemsDiv.innerHTML = '';
    emptyDiv.style.display = 'block';
    totalDiv.style.display = 'none';
    return;
  }
  emptyDiv.style.display = 'none';
  totalDiv.style.display = 'block';
  let total = 0;
  itemsDiv.innerHTML = currentCart.map(item => {
    const p = item.product;
    const subtotal = (p.price * item.quantity).toFixed(2);
    total += p.price * item.quantity;
    return `
      <div class="cart-item">
        <img src="${p.images[0]}" alt="${p.name}">
        <div style="flex: 1;">
          <h3>${p.name}</h3>
          ${item.variant ? `<p>Variant: ${JSON.stringify(item.variant)}</p>` : ''}
          <p>$${p.price.toFixed(2)} each</p>
          <div class="qty-controls">
            <button onclick="changeQty(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQty(${item.id}, 1)">+</button>
            <button class="btn" onclick="removeFromCart(${item.id})" style="padding: 0.25rem 0.5rem; font-size: 0.9rem;">Remove</button>
          </div>
        </div>
        <p>$${subtotal}</p>
      </div>
    `;
  }).join('');
  totalSpan.textContent = total.toFixed(2);
}

function renderCheckout() {
  renderCartSummary(); // Reuse cart render logic for summary
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate order
      localStorage.removeItem('cart');
      updateCartCount();
      document.getElementById('checkout-form').style.display = 'none';
      document.getElementById('order-summary').style.display = 'none';
      document.getElementById('thank-you').style.display = 'block';
    });
  }
}

function renderCartSummary() {
  // Simple summary for checkout
  const currentCart = getCart();
  const summaryDiv = document.getElementById('order-summary');
  if (currentCart.length === 0) {
    summaryDiv.innerHTML = '<p>No items in cart.</p>';
    return;
  }
  let total = 0;
  summaryDiv.innerHTML = currentCart.map(item => {
    const p = item.product;
    total += p.price * item.quantity;
    return `<div class="cart-item"><span>${p.name} x${item.quantity}</span><span>$${(p.price * item.quantity).toFixed(2)}</span></div>`;
  }).join('') + `<p><strong>Total: $${total.toFixed(2)}</strong></p>`;
}

function attachEventListeners() {
  // Index specific
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      const category = document.querySelector('.category-filter.active')?.dataset.category || 'all';
      const filtered = filterProducts(e.target.value, category);
      renderProducts(filtered);
    }, 300));
  }
  document.querySelectorAll('.category-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const searchTerm = document.getElementById('search-input')?.value || '';
      const filtered = filterProducts(searchTerm, e.target.dataset.category);
      renderProducts(filtered);
    });
  });
  // Global add to cart delegation
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn') && e.target.dataset.id && !e.target.id) { // not detail btn
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    }
  });
}

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function addToCart(productId, variant = null) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    showError('Product not found.');
    return;
  }
  let currentCart = getCart();
  let cartItem = currentCart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    currentCart.push({ id: productId, product, quantity: 1, variant });
  }
  localStorage.setItem('cart', JSON.stringify(currentCart));
  updateCartCount();
  // Visual feedback if on index or product
  const btn = document.querySelector(`[data-id="${productId}"]`);
  if (btn && !btn.id) {
    const original = btn.textContent;
    btn.textContent = 'Added!';
    setTimeout(() => { btn.textContent = original; }, 1000);
  }
}

function updateCartCount() {
  const currentCart = getCart();
  const totalItems = currentCart.reduce((sum, item) => sum + item.quantity, 0, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = totalItems;
}

document.addEventListener('DOMContentLoaded', init);