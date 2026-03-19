let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsDiv = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");

/* ======== RENDER CART ======== */
function renderCart() {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  if (!cart.length) {
    cartItemsDiv.innerHTML =
      "<p style='text-align:center;color:#777;'>Your cart is empty</p>";
  }

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image || 'Images/RS KOTA .jpg'}">
      <div class="item-info">
        <div class="item-top">
          <div class="item-title">${item.name}</div>
          <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        </div>
        <div>${item.restaurant}</div>
        <div class="price-row">R${item.price}</div>
        <div class="qty-controls">
          <button onclick="updateQty(${index}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${index}, 1)">+</button>
        </div>
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });

  totalPriceEl.innerText = "R" + total.toFixed(2);
  // Save total to localStorage for checkout
  localStorage.setItem("cartTotal", total.toFixed(2));
}

/* ======== UPDATE QTY ======== */
function updateQty(index, delta) {
  cart[index].qty += delta;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  renderCart();
}

/* ======== REMOVE ITEM ======== */
function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

/* ======== TAB SWITCH ======== */
function setTab(tab) {
  document.getElementById("inProgress").style.display =
    tab === "inProgress" ? "block" : "none";
  document.getElementById("completed").style.display =
    tab === "completed" ? "block" : "none";

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelector(`.tab.${tab === "inProgress" ? "in-progress" : "completed"}`)
    .classList.add("active");
}

/* ======== BACK BUTTON ======== */
function goBack() {
  window.history.back();
}

/* ======== CHECKOUT ======== */
function goToCheckout() {
  window.location.href = "checkout.html";
}

/* ======== ADD-ON MENU POPUP ======== */
function openAddonMenu() {
  document.getElementById("addonModal").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeAddonMenu() {
  document.getElementById("addonModal").style.display = "none";
  document.body.style.overflow = "auto";
}

/* ======== ADD ITEM FROM POPUP ======== */
function addItemFromPopup(item) {
  // Example item structure: {name, price, restaurant, qty, image}
  cart.push(item);
  renderCart();
  closeAddonMenu();
}

/* ======== MOCK: Listen to messages from iframe ======== */
window.addEventListener("message", (e) => {
  if (e.data && e.data.type === "addToCart") {
    addItemFromPopup(e.data.item);
  }
});

/* ======== INIT ======== */
renderCart();

// Store subtotal in localStorage whenever rendering cart
// Already handled inside renderCart() above