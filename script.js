// Frontend Mentor - Product list with cart

// Global variables
let products = [];
let cart = [];

// DOM elements
const productsGrid = document.getElementById("products-grid");
const cartCount = document.getElementById("cart-count");
const cartEmpty = document.getElementById("cart-empty");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const orderTotalAmount = document.getElementById("order-total-amount");
const confirmOrderBtn = document.getElementById("confirm-order-btn");
const orderModal = document.getElementById("order-modal");
const modalOrderItems = document.getElementById("modal-order-items");
const modalTotalAmount = document.getElementById("modal-total-amount");
const startNewOrderBtn = document.getElementById("start-new-order-btn");

// Templates
const productCardTemplate = document.getElementById("product-card-template");
const modalItemTemplate = document.getElementById("modal-item-template");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  console.log("Product list with cart loaded");
  loadProducts();
});

// Fetch and parse data from data.json
async function loadProducts() {
  try {
    console.log("Loading products...");
    const response = await fetch("./data.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    products = data;

    console.log("Products loaded successfully:", products.length, "items");

    // Generate product cards after data is loaded
    generateProductCards();
  } catch (error) {
    console.error("Error loading products:", error);

    // Show error message to user
    const productsGrid = document.getElementById("products-grid");
    productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--rose-500);">
        <p>Sorry, we couldn't load the products. Please try refreshing the page.</p>
      </div>
    `;
  }
}

// Generate product cards from loaded data
function generateProductCards() {
  const productsGrid = document.getElementById("products-grid");
  const template = document.getElementById("product-card-template");

  // Clear existing content
  productsGrid.innerHTML = "";

  products.forEach((product, index) => {
    // Clone the template
    const clone = template.content.cloneNode(true);

    // Get references to elements in the clone
    const productCard = clone.querySelector(".product-card");
    const desktopImage = clone.querySelector(".desktop-image");
    const tabletImage = clone.querySelector(".tablet-image");
    const mobileImage = clone.querySelector(".mobile-image");
    const addToCartBtn = clone.querySelector(".add-to-cart-btn");
    const incrementBtn = clone.querySelector(".increment-btn");
    const decrementBtn = clone.querySelector(".decrement-btn");
    const categoryElement = clone.querySelector(".product-category");
    const nameElement = clone.querySelector(".product-name");
    const priceElement = clone.querySelector(".product-price");

    // Set product data
    productCard.dataset.productId = index;
    desktopImage.srcset = product.image.desktop;
    tabletImage.srcset = product.image.tablet;
    mobileImage.src = product.image.mobile;
    mobileImage.alt = product.name;

    addToCartBtn.dataset.productId = index;
    incrementBtn.dataset.productId = index;
    decrementBtn.dataset.productId = index;

    categoryElement.textContent = product.category;
    nameElement.textContent = product.name;
    priceElement.textContent = `$${product.price.toFixed(2)}`;

    // Add the card to the grid
    productsGrid.appendChild(clone);
  });

  console.log("Product cards generated successfully");

  // Add event listeners after cards are generated
  addProductEventListeners();

  // Add cart event listeners
  addCartEventListeners();
}

// Add event listeners to product buttons
function addProductEventListeners() {
  // Add to cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", handleAddToCart);
  });

  // Quantity control buttons
  document.querySelectorAll(".increment-btn").forEach((button) => {
    button.addEventListener("click", handleIncrement);
  });

  document.querySelectorAll(".decrement-btn").forEach((button) => {
    button.addEventListener("click", handleDecrement);
  });

  console.log("Product event listeners added");
}

// Cart functionality implementation
function handleAddToCart(event) {
  const productId = parseInt(event.target.dataset.productId);
  const product = products[productId];

  console.log("Adding to cart:", product.name);

  // Add item to cart
  addItemToCart(productId);

  // Update UI
  updateProductCardUI(productId);
  updateCartUI();
}

// Cart event listeners
function addCartEventListeners() {
  const confirmOrderBtn = document.getElementById("confirm-order-btn");
  const startNewOrderBtn = document.getElementById("start-new-order-btn");
  const modalOverlay = document.getElementById("order-modal");

  confirmOrderBtn.addEventListener("click", handleConfirmOrder);
  startNewOrderBtn.addEventListener("click", handleStartNewOrder);

  // Close modal when clicking outside
  modalOverlay.addEventListener("click", function (event) {
    if (event.target === modalOverlay) {
      closeOrderModal();
    }
  });

  console.log("Cart event listeners added");
}

// Order confirmation modal functionality
function handleConfirmOrder() {
  console.log("Confirm order clicked");

  if (cart.length === 0) {
    console.log("Cannot confirm empty cart");
    return;
  }

  // Populate modal with order items
  populateOrderModal();

  // Show modal
  showOrderModal();
}

function populateOrderModal() {
  const modalOrderItems = document.getElementById("modal-order-items");
  const modalTotalAmount = document.getElementById("modal-total-amount");
  const modalItemTemplate = document.getElementById("modal-item-template");

  // Clear existing items
  modalOrderItems.innerHTML = "";

  // Calculate total
  const totalPrice = cart.reduce((sum, item) => {
    const product = products[item.productId];
    return sum + product.price * item.quantity;
  }, 0);

  // Update total
  modalTotalAmount.textContent = `$${totalPrice.toFixed(2)}`;

  // Generate order items
  cart.forEach((cartItem) => {
    const product = products[cartItem.productId];
    const itemTotal = product.price * cartItem.quantity;

    // Clone template
    const clone = modalItemTemplate.content.cloneNode(true);

    // Get references to elements
    const thumbnail = clone.querySelector(".modal-item-thumbnail");
    const name = clone.querySelector(".modal-item-name");
    const quantity = clone.querySelector(".modal-item-quantity");
    const price = clone.querySelector(".modal-item-price");
    const total = clone.querySelector(".modal-item-total");

    // Set data
    thumbnail.src = product.image.thumbnail;
    thumbnail.alt = product.name;
    name.textContent = product.name;
    quantity.textContent = `${cartItem.quantity}x`;
    price.textContent = `@ $${product.price.toFixed(2)}`;
    total.textContent = `$${itemTotal.toFixed(2)}`;

    // Add to modal
    modalOrderItems.appendChild(clone);
  });

  console.log("Order modal populated with", cart.length, "items");
}

function showOrderModal() {
  const modal = document.getElementById("order-modal");
  modal.style.display = "flex";

  // Prevent body scroll
  document.body.style.overflow = "hidden";

  // Focus on the modal for accessibility
  modal.focus();

  console.log("Order modal shown");
}

function closeOrderModal() {
  const modal = document.getElementById("order-modal");
  modal.style.display = "none";

  // Restore body scroll
  document.body.style.overflow = "";

  console.log("Order modal closed");
}

function handleStartNewOrder() {
  console.log("Start new order clicked");

  // Reset cart
  cart = [];

  // Update all product card UIs
  products.forEach((product, index) => {
    updateProductCardUI(index);
  });

  // Update cart UI
  updateCartUI();

  // Close modal
  closeOrderModal();

  console.log("New order started - cart reset");
}

function handleIncrement(event) {
  const productId = parseInt(event.target.dataset.productId);
  console.log("Incrementing product:", productId);

  // Update cart quantity
  incrementCartItem(productId);

  // Update UI
  updateProductCardUI(productId);
  updateCartUI();
}

function handleDecrement(event) {
  const productId = parseInt(event.target.dataset.productId);
  console.log("Decrementing product:", productId);

  // Update cart quantity
  decrementCartItem(productId);

  // Update UI
  updateProductCardUI(productId);
  updateCartUI();
}

// Cart state management functions
function addItemToCart(productId) {
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
    });
  }

  console.log("Cart updated:", cart);
}

function incrementCartItem(productId) {
  const item = cart.find((item) => item.productId === productId);
  if (item) {
    item.quantity += 1;
  }
}

function decrementCartItem(productId) {
  const item = cart.find((item) => item.productId === productId);
  if (item) {
    item.quantity -= 1;

    // Remove item if quantity reaches 0
    if (item.quantity <= 0) {
      const index = cart.findIndex(
        (cartItem) => cartItem.productId === productId
      );
      cart.splice(index, 1);
    }
  }
}

function getCartItemQuantity(productId) {
  const item = cart.find((item) => item.productId === productId);
  return item ? item.quantity : 0;
}

// UI update functions
function updateProductCardUI(productId) {
  const productCard = document.querySelector(
    `[data-product-id="${productId}"]`
  );
  const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
  const quantityControls = productCard.querySelector(".quantity-controls");
  const quantityDisplay = productCard.querySelector(".quantity-display");

  const quantity = getCartItemQuantity(productId);

  if (quantity > 0) {
    // Show quantity controls, hide add to cart button
    addToCartBtn.style.display = "none";
    quantityControls.style.display = "flex";
    quantityDisplay.textContent = quantity;
  } else {
    // Show add to cart button, hide quantity controls
    addToCartBtn.style.display = "flex";
    quantityControls.style.display = "none";
  }
}

function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  const cartEmpty = document.getElementById("cart-empty");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const orderTotalAmount = document.getElementById("order-total-amount");

  // Calculate total items and total price
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const product = products[item.productId];
    return sum + product.price * item.quantity;
  }, 0);

  // Update cart count
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    // Show empty state
    cartEmpty.style.display = "block";
    cartTotal.style.display = "none";
    cartItems.innerHTML = "";
  } else {
    // Show cart items
    cartEmpty.style.display = "none";
    cartTotal.style.display = "block";

    // Update total amount
    orderTotalAmount.textContent = `$${totalPrice.toFixed(2)}`;

    // Generate cart items
    generateCartItems();
  }

  console.log(`Cart updated: ${totalItems} items, $${totalPrice.toFixed(2)}`);
}

function generateCartItems() {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";

  cart.forEach((cartItem) => {
    const product = products[cartItem.productId];
    const itemTotal = product.price * cartItem.quantity;

    const cartItemElement = document.createElement("div");
    cartItemElement.className = "cart-item";
    cartItemElement.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${product.name}</div>
        <div class="cart-item-details">
          <span class="cart-item-quantity">${cartItem.quantity}x</span>
          <span class="cart-item-price">@ $${product.price.toFixed(2)}</span>
        </div>
      </div>
      <div class="cart-item-actions">
        <span class="cart-item-total">$${itemTotal.toFixed(2)}</span>
        <button class="remove-btn" data-product-id="${cartItem.productId}">
          <img src="./assets/images/icon-remove-item.svg" alt="Remove item">
        </button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItemElement);
  });

  // Add event listeners to remove buttons
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", handleRemoveItem);
  });
}

function handleRemoveItem(event) {
  const productId = parseInt(
    event.target.closest(".remove-btn").dataset.productId
  );
  console.log("Removing item:", productId);

  // Remove item from cart
  const index = cart.findIndex((item) => item.productId === productId);
  if (index !== -1) {
    cart.splice(index, 1);
  }

  // Update UI
  updateProductCardUI(productId);
  updateCartUI();
}
