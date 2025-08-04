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
  // Functionality will be added in Phase 4 JavaScript tasks
});
