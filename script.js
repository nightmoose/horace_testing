const products = [
  {
    id: 1,
    name: 'iPhone 15',
    price: 999,
    category: 'electronics',
    image: 'https://picsum.photos/300/400?random=1',
    variants: [
      {name: '128GB', delta: 0},
      {name: '256GB', delta: 100},
      {name: '512GB', delta: 300}
    ]
  },
  {
    id: 2,
    name: 'Dell XPS Laptop',
    price: 1299,
    category: 'electronics',
    image: 'https://picsum.photos/300/400?random=2',
    variants: [
      {name: '16GB RAM', delta: 0},
      {name: '32GB RAM', delta: 200}
    ]
  },
  {
    id: 3,
    name: 'Cotton T-Shirt',
    price: 19.99,
    category: 'clothing',
    image: 'https://picsum.photos/300/400?random=3',
    variants: [
      {name: 'S', delta: 0},
      {name: 'M', delta: 0},
      {name: 'L', delta: 0},
      {name: 'XL', delta: 0}
    ]
  },
  {
    id: 4,
    name: 'Slim Jeans',
    price: 49.99,
    category: 'clothing',
    image: 'https://picsum.photos/300/400?random=4',
    variants: [
      {name: '30 Waist', delta: 0},
      {name: '32 Waist', delta: 0},
      {name: '34 Waist', delta: 0}
    ]
  },
  {
    id: 5,
    name: 'Atomic Habits',
    price: 14.99,
    category: 'books',
    image: 'https://picsum.photos/300/400?random=5',
    variants: []
  },
  {
    id: 6,
    name: 'Clean Code',
    price: 39.99,
    category: 'books',
    image: 'https://picsum.photos/300/400?random=6',
    variants: []
  },
  {
    id: 7,
    name: 'Modern Sofa',
    price: 599,
    category: 'home',
    image: 'https://picsum.photos/300/400?random=7',
    variants: [
      {name: 'Gray', delta: 0},
      {name: 'Beige', delta: 50}
    ]
  },
  {
    id: 8,
    name: 'Desk Lamp',
    price: 29.99,
    category: 'home',
    image: 'https://picsum.photos/300/400?random=8',
    variants: []
  },
  {
    id: 9,
    name: 'Sony Headphones',
    price: 199,
    category: 'electronics',
    image: 'https://picsum.photos/300/400?random=9',
    variants: [
      {name: 'Wireless', delta: 0}
    ]
  },
  {
    id: 10,
    name: 'Rolex Watch',
    price: 299,
    category: 'clothing',
    image: 'https://picsum.photos/300/400?random=10',
    variants: [
      {name: 'Silver', delta: 0},
      {name: 'Gold', delta: 100}
    ]
  }
];

function getProducts(search = '', category = '') {
  return products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (!category || p.category === category)
  );
}

function getProduct(id) {
  return products.find(p => p.id == id);
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id, variantIndex = 0) {
  const product = getProduct(id);
  if (!product) return;
  const cart = getCart();
  const variant = product.variants[variantIndex] || {name: 'Standard', delta: 0};
  const price = product.price + variant.delta;
  const existingIndex = cart.findIndex(item => item.id === id && item.variantIndex === variantIndex);
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      id,
      variantIndex,
      name: product.name,
      price,
      variant: variant.name,
      qty: 1,
      image: product.image
    });
  }
  saveCart(cart);
  alert('Added to cart!');
}

function removeFromCart(id, variantIndex) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === id && item.variantIndex === variantIndex));
  saveCart(cart);
  renderCart(document.getElementById('cart-items'));
}

function updateQty(id, variantIndex, delta) {
  let cart = getCart();
  const item = cart.find(item => item.id === id && item.variantIndex === variantIndex);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id, variantIndex);
    } else {
      saveCart(cart);
      if (location.pathname.includes('cart.html') || location.pathname.includes('checkout.html')) {
        initPage();
      }
    }
  }
}

function getTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderProducts(container, prods) {
  container.innerHTML = '';
  prods.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price.toFixed(2)}</p>
      <a href="product.html?id=${p.id}">View Details</a>
    `;
    container.appendChild(card);
  });
}

function renderProductDetail(container, product) {
  if (!product) {
    container.innerHTML = '<p>Product not found</p>';
    return;
  }
  const optionsHtml = product.variants.length 
    ? product.variants.map((v, i) => `<option value="${i}">${v.name}</option>`).join('')
    : '<option value="0">Standard</option>';
  container.innerHTML = `
    <div class="product-detail">
      <div class="detail-img">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="detail-info">
        <h1>${product.name}</h1>
        <p id="price">$${product.price.toFixed(2)}</p>
        <p id="variant-name"></p>
        <select id="variant-select">${optionsHtml}</select>
        <button id="add-to-cart">Add to Cart</button>
      </div>
    </div>
  `;
  const variantSelect = document.getElementById('variant-select');
  const priceEl = document.getElementById('price');
  const variantNameEl = document.getElementById('variant-name');
  const addBtn = document.getElementById('add-to-cart');
  let currentVariantIndex = 0;
  function updateVariant() {
    const v = product.variants[currentVariantIndex] || {name: 'Standard', delta: 0};
    priceEl.textContent = `$${(product.price + v.delta).toFixed(2)}`;
    variantNameEl.textContent = v.name;
  }
  variantSelect.onchange = (e) => {
    currentVariantIndex = parseInt(e.target.value);
    updateVariant();
  };
  updateVariant();
  addBtn.onclick = () => {
    addToCart(product.id, currentVariantIndex);
  };
}

function renderCart(container) {
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty. <a href="index.html">Continue shopping</a></p>';
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div style="flex:1;">
        <h3>${item.name} (${item.variant})</h3>
        <p>$${item.price.toFixed(2)} each</p>
      </div>
      <div class="qty-controls">
        <button onclick="updateQty(${item.id}, ${item.variantIndex}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="updateQty(${item.id}, ${item.variantIndex}, 1)">+</button>
        <button onclick="removeFromCart(${item.id}, ${item.variantIndex})" style="background:#dc3545;">Remove</button>
      </div>
      <p>Sub: $${(item.price * item.qty).toFixed(2)}</p>
    </div>
  `).join('') + `
    <div style="text-align:right; font-weight:bold; font-size:1.2rem;">
      Total: $${getTotal().toFixed(2)}
    </div>
  `;
}

function renderCheckout(container) {
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = '<p>No items to checkout. <a href="index.html">Shop now</a></p>';
    return;
  }
  let summaryHtml = '<div class="checkout-summary">';
  cart.forEach(item => {
    summaryHtml += `<div>${item.name} (${item.variant}) x ${item.qty}: $${(item.price * item.qty).toFixed(2)}</div>`;
  });
  summaryHtml += `<div style="font-weight:bold;">Total: $${getTotal().toFixed(2)}</div></div>`;
  container.innerHTML = summaryHtml + `
    <form class="checkout-form">
      <input type="text" placeholder="Full Name" required>
      <input type="text" placeholder="Address" required>
      <input type="text" placeholder="City" required>
      <input type="tel" placeholder="Phone" required>
      <div style="margin:1rem 0; padding:1rem; background:#f0f0f0; border-radius:4px;">
        Payment Method: Placeholder (integrate Stripe/PayPal in production)
      </div>
      <button type="button" id="place-order">Place Order</button>
    </form>
  `;
  document.getElementById('place-order').onclick = () => {
    alert('Thank you for your order! (Demo)');
    localStorage.removeItem('cart');
    location.href = 'index.html';
  };
}

function initPage() {
  const pathname = location.pathname.split('/').pop() || 'index.html';
  if (pathname === 'index.html' || pathname === '') {
    filterProducts(); // initial render
  } else if (pathname === 'product.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const product = getProduct(id);
    renderProductDetail(document.getElementById('detail'), product);
  } else if (pathname === 'cart.html') {
    renderCart(document.getElementById('cart-items'));
  } else if (pathname === 'checkout.html') {
    renderCheckout(document.getElementById('order-summary'));
  }
}

function filterProducts() {
  const search = document.getElementById('search')?.value || '';
  const category = document.getElementById('category')?.value || '';
  renderProducts(document.getElementById('products'), getProducts(search, category));
}