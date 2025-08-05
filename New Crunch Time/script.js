// Sample restaurant data
const restaurants = [
    {
        id: 1,
        name: "Pizza Palace",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a680",
        menu: [
            { id: 1, name: "Margherita Pizza", price: 12.99 },
            { id: 2, name: "Pepperoni Pizza", price: 14.99 },
            { id: 3, name: "Garlic Bread", price: 5.99 }
        ]
    },
    {
        id: 2,
        name: "Burger Bonanza",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        menu: [
            { id: 4, name: "Classic Burger", price: 8.99 },
            { id: 5, name: "Cheeseburger", price: 9.99 },
            { id: 6, name: "Fries", price: 3.99 }
        ]
    }
];

// Cart state
let cart = [];

// DOM elements
const restaurantsSection = document.getElementById('restaurants');
const cartSidebar = document.getElementById('cart-sidebar');
const cartToggle = document.getElementById('cart-toggle');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

// Render restaurants
function renderRestaurants() {
    restaurantsSection.innerHTML = '';
    restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow p-4';
        card.innerHTML = `
            <img src="${restaurant.image}" alt="${restaurant.name}" class="w-full h-48 object-cover rounded-lg mb-4">
            <h2 class="text-xl font-semibold">${restaurant.name}</h2>
            <div class="mt-4">
                ${restaurant.menu.map(item => `
                    <div class="flex justify-between items-center mb-2">
                        <span>${item.name} - $${item.price.toFixed(2)}</span>
                        <button class="add-to-cart bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                            Add
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        restaurantsSection.appendChild(card);
    });
}

// Render cart
function renderCart() {
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item flex justify-between items-center border-b py-2';
        itemDiv.innerHTML = `
            <span>{item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        cartItems.appendChild(itemDiv);
    });
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal.textContent = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
}

// Add to cart
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    renderCart();
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('translate-x-full');
}

// Event listeners
cartToggle.addEventListener('click', toggleCart);
cartClose.addEventListener('click', toggleCart);

restaurantsSection.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const id = parseInt(e.target.dataset.id);
        const name = e.target.dataset.name;
        const price = parseFloat(e.target.dataset.price);
        addToCart(id, name, price);
    }
});

// Initialize
renderRestaurants();
renderCart();