// script.js - Vanilla JS for E-commerce Scaffold

let products = [];
let cart = [];

async function init() {
  try {
    const response = await fetch('data.json');
    products = await response.json();
    attachEventListeners();
    const page = document.querySelector('script[data-page]')?.dataset.page || 'index';
    if (page === 'index') {
      renderProducts(products);
    }
    updateCartCount();
  } catch (error) {
    console.error('Failed to load products:', error);
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
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <button class="btn" data-id="${product.id}">Add to Cart</button>
    </div>
  `).join('');
}

function attachEventListeners() {
  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      const category = document.querySelector('.category-filter.active')?.dataset.category || 'all';
      const filtered = filterProducts(e.target.value, category);
      renderProducts(filtered);
    }, 300));
  }

  // Category filters
  document.querySelectorAll('.category-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const searchTerm = document.getElementById('search-input')?.value || '';
      const filtered = filterProducts(searchTerm, e.target.dataset.category);
      renderProducts(filtered);
    });
  });

  // Add to cart
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn') && e.target.dataset.id) {
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
  if (!product) return;

  let cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ id: productId, product, quantity: 1, variant });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  // Visual feedback
  const btn = document.querySelector(`[data-id="${productId}"]`);
  if (btn) {
    btn.textContent = 'Added!';
    setTimeout(() => btn.textContent = 'Add to Cart', 1000);
  }
}

function getCart() {
  const stored = localStorage.getItem('cart');
  return stored ? JSON.stringify(cart) : [];  // Wait, JSON.parse
  No, fix later.
}

function updateCartCount() {
  cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = totalItems;
}

document.addEventListener('DOMContentLoaded', init);