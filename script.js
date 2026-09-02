const products = [
    {
        id: 1,
        name: "Fresh Orange",
        category: "Fruit",
        price: 99,
        icon: "🍊",
        description: "Fresh and refreshing orange juice."
    },
    {
        id: 2,
        name: "Mango Delight",
        category: "Fruit",
        price: 129,
        icon: "🥭",
        description: "Sweet and creamy mango juice."
    },
    {
        id: 3,
        name: "Watermelon Fresh",
        category: "Fruit",
        price: 89,
        icon: "🍉",
        description: "Refreshing watermelon juice."
    },
    {
        id: 4,
        name: "Strawberry Shake",
        category: "Milkshake",
        price: 149,
        icon: "🍓",
        description: "Creamy strawberry milkshake."
    },
    {
        id: 5,
        name: "Banana Shake",
        category: "Milkshake",
        price: 119,
        icon: "🍌",
        description: "Rich and delicious banana shake."
    },
    {
        id: 6,
        name: "Berry Blast",
        category: "Special",
        price: 159,
        icon: "🫐",
        description: "A delicious mix of fresh berries."
    },
    {
        id: 7,
        name: "Pineapple Juice",
        category: "Fruit",
        price: 109,
        icon: "🍍",
        description: "Sweet and tangy pineapple juice."
    },
    {
        id: 8,
        name: "Green Detox",
        category: "Special",
        price: 139,
        icon: "🥝",
        description: "Healthy green juice with fresh fruits."
    }
];


let cart = JSON.parse(
    localStorage.getItem("freshSipCart")
) || [];

let selectedCategory = "all";


const productsContainer =
    document.getElementById("productsContainer");

const searchInput =
    document.getElementById("searchInput");

const categoryButtons =
    document.querySelectorAll(".category");

const cartBtn =
    document.getElementById("cartBtn");

const cartSidebar =
    document.getElementById("cartSidebar");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const checkoutBtn =
    document.getElementById("checkoutBtn");

const orderModal =
    document.getElementById("orderModal");

const closeModal =
    document.getElementById("closeModal");

const orderForm =
    document.getElementById("orderForm");

const orderSuccess =
    document.getElementById("orderSuccess");

const menuBtn =
    document.getElementById("menuBtn");

const navMenu =
    document.getElementById("navMenu");


/* DISPLAY PRODUCTS */

function displayProducts() {

    const searchText =
        searchInput.value.toLowerCase();


    const filteredProducts =
        products.filter(function(product) {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;


            return matchesSearch && matchesCategory;

        });


    productsContainer.innerHTML = "";


    if (filteredProducts.length === 0) {

        productsContainer.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:50px;">
                <h3>No juice found</h3>
                <p>Try another search.</p>
            </div>
        `;

        return;
    }


    filteredProducts.forEach(function(product) {

        const card =
            document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">
                ${product.icon}
            </div>

            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description}
                </p>

                <div class="product-bottom">

                    <span class="price">
                        ₹${product.price}
                    </span>

                    <button
                        class="add-btn"
                        onclick="addToCart(${product.id})"
                    >
                        + Add
                    </button>

                </div>

            </div>

        `;


        productsContainer.appendChild(card);

    });

}


/* CATEGORY */

categoryButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        categoryButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });


        button.classList.add("active");

        selectedCategory =
            button.dataset.category;


        displayProducts();

    });

});


/* SEARCH */

searchInput.addEventListener(
    "input",
    displayProducts
);


/* ADD TO CART */

function addToCart(id) {

    const existingItem =
        cart.find(function(item) {
            return item.id === id;
        });


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }


    saveCart();

    updateCart();

    openCart();

}


/* SAVE CART */

function saveCart() {

    localStorage.setItem(
        "freshSipCart",
        JSON.stringify(cart)
    );

}


/* UPDATE CART */

function updateCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        cartCount.textContent = "0";

        cartTotal.textContent = "₹0";

        return;
    }


    let total = 0;
    let count = 0;


    cart.forEach(function(item) {

        const product =
            products.find(function(product) {
                return product.id === item.id;
            });


        const itemTotal =
            product.price * item.quantity;


        total += itemTotal;

        count += item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div>

                <h4>
                    ${product.name}
                </h4>

                <p>
                    ₹${product.price}
                </p>

                <div class="quantity">

                    <button
                        onclick="changeQuantity(${product.id}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${product.id}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>


            <button
                class="remove-item"
                onclick="removeFromCart(${product.id})"
            >
                Remove
            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    cartCount.textContent = count;

    cartTotal.textContent =
        "₹" + total;

}


/* CHANGE QUANTITY */

function changeQuantity(id, amount) {

    const item =
        cart.find(function(item) {
            return item.id === id;
        });


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(function(item) {
                return item.id !== id;
            });

    }


    saveCart();

    updateCart();

}


/* REMOVE */

function removeFromCart(id) {

    cart =
        cart.filter(function(item) {
            return item.id !== id;
        });


    saveCart();

    updateCart();

}


/* OPEN CART */

function openCart() {

    cartSidebar.classList.add("show");

    cartOverlay.classList.add("show");

}


/* CLOSE CART */

function closeCartSidebar() {

    cartSidebar.classList.remove("show");

    cartOverlay.classList.remove("show");

}


cartBtn.addEventListener(
    "click",
    openCart
);

closeCart.addEventListener(
    "click",
    closeCartSidebar
);

cartOverlay.addEventListener(
    "click",
    closeCartSidebar
);


/* CHECKOUT */

checkoutBtn.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Please add a juice to your cart first.");

        return;
    }


    orderSuccess.textContent = "";

    orderModal.classList.add("show");

    closeCartSidebar();

});


/* CLOSE MODAL */

closeModal.addEventListener("click", function() {

    orderModal.classList.remove("show");

});


window.addEventListener("click", function(event) {

    if (event.target === orderModal) {

        orderModal.classList.remove("show");

    }

});


/* ORDER */

orderForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("customerName").value;


    orderSuccess.textContent =
        "Thank you " +
        name +
        "! Your order has been placed successfully. 🍹";


    cart = [];

    saveCart();

    updateCart();

    orderForm.reset();

});


/* MOBILE MENU */

menuBtn.addEventListener("click", function() {

    navMenu.classList.toggle("show");

});


document.querySelectorAll("#navMenu a")
.forEach(function(link) {

    link.addEventListener("click", function() {

        navMenu.classList.remove("show");

    });

});


/* INITIAL */

displayProducts();

updateCart();