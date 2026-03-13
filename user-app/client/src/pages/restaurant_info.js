
/* --- Initialize Page --- */
const params = new URLSearchParams(window.location.search);
const restaurantName = params.get("name");
const restaurant = restaurantData[restaurantName];

if (restaurant) {
  document.getElementById("restaurantName").innerText = restaurantName;
  document.getElementById("restaurantImage").src = restaurant.image;
  document.getElementById("mapLink").href = restaurant.map;

  const menuDiv = document.getElementById("menu");
  restaurant.menu.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `<span>${item.name}</span><span>R${item.price}</span>`;
    div.onclick = () => openFoodModal(item);
    menuDiv.appendChild(div);
  });
} else {
  document.getElementById("restaurantName").innerText = "Restaurant Not Found";
}

/* --- Modal functions --- */
function openFoodModal(item) {
  selectedItem = item;
  quantity = 1;
  document.getElementById("foodItemName").innerText = item.name;
  document.getElementById("foodQuantity").innerText = quantity;
  document.getElementById("extraCheese").checked = false;
  document.getElementById("lessSalt").checked = false;
  document.getElementById("specialInstructions").value = "";
  document.getElementById("foodModal").style.display = "flex";
}

function closeFoodModal() {
  document.getElementById("foodModal").style.display = "none";
}

function changeQuantity(val) {
  quantity = Math.max(1, quantity + val);
  document.getElementById("foodQuantity").innerText = quantity;
}

function addItemToOrder() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({
    ...selectedItem,
    restaurant: restaurantName,
    qty: quantity,
    options: {
      extraCheese: document.getElementById("extraCheese").checked,
      lessSalt: document.getElementById("lessSalt").checked,
      instructions: document.getElementById("specialInstructions").value
    }
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(selectedItem.name + " added to cart!");
  closeFoodModal();
}

function changeDelivery() {
  const times = ["15 – 25 min", "20 – 35 min", "30 – 45 min"];
  document.getElementById("deliveryTime").innerText =
    "🚚 Deliver in " + times[Math.floor(Math.random() * times.length)];
}