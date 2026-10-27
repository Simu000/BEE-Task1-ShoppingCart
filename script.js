// Task - Ecommerce shopping cart should include these features
// 1. Product filtering and sorting
// 2. Add remove cart items
// 3. Quantity and price calculation
// 4. Discount coupon and checkout UI

let arr = [
  {
    pic: " images/sam.png",
    brand: "Samsung",
    model: "Galaxy S26",
    price: 89999,
    color: "white",
    ram: "12GB",
    storage: "256GB",
  },
  {
    pic: " images/app.png",
    brand: "Apple",
    model: "iPhone 17",
    price: 79900,
    color: "black",
    ram: "8GB",
    storage: "256GB",
  },
  {
    pic: " images/one+.png",
    brand: "OnePlus",
    model: "OnePlus 13",
    price: 69999,
    color: "blue",
    ram: "12GB",
    storage: "512GB",
  },
  {
    pic: " images/menote.png",
    brand: "Xiaomi",
    model: "Redmi Note 14",
    price: 18999,
    color: "purple",
    ram: "8GB",
    storage: "128GB",
  },
  {
    pic: " images/dell.png",
    brand: "Dell",
    model: "Inspiron 15",
    price: 58999,
    color: "silver",
    ram: "16GB",
    storage: "512GB SSD",
  },
  {
    pic: " images/pav.png",
    brand: "HP",
    model: "Pavilion 14",
    price: 64999,
    color: "blue",
    ram: "16GB",
    storage: "1TB SSD",
  },
  {
    pic: " images/idea.png",
    brand: "Lenovo",
    model: "IdeaPad Slim 5",
    price: 54999,
    color: "grey",
    ram: "16GB",
    storage: "512GB SSD",
  },
  {
    pic: " images/vivo.png",
    brand: "Asus",
    model: "VivoBook 15",
    price: 47999,
    color: "silver",
    ram: "8GB",
    storage: "512GB SSD",
  },
  {
    pic: " images/me.png",
    brand: "Realme",
    model: "Realme GT 7",
    price: 39999,
    color: "green",
    ram: "12GB",
    storage: "256GB",
  },
];

const cardsContainer = document.getElementById("card-container");
const brandFilter = document.getElementById("brand-filter");
const sortProducts = document.getElementById("sort-products");
const cartItemsContainer = document.getElementById("cart-items");
const subtotalPrice = document.getElementById("subtotal-price");
const shippingPrice = document.getElementById("shipping-price");
const discountPrice = document.getElementById("discount-price");
const totalPrice = document.getElementById("total-price");
const couponInput = document.getElementById("coupon-input");
const couponMessage = document.getElementById("coupon-message");
const checkoutBtn = document.getElementById("checkout-btn");

let cart = [];
let activeCoupon = "";
let currentFilter = "all";
let currentSort = "featured";

function formatCurrency(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function getUniqueBrands() {
  return [...new Set(arr.map((item) => item.brand))].sort();
}

function populateBrandFilter() {
  const brands = getUniqueBrands();

  brandFilter.innerHTML = '<option value="all">All Brands</option>';
  brands.forEach((brand) => {
    brandFilter.innerHTML += `<option value="${brand}">${brand}</option>`;
  });
}

function getFilteredAndSortedProducts() {
  let filtered = [...arr];

  if (currentFilter !== "all") {
    filtered = filtered.filter((item) => item.brand === currentFilter);
  }

  if (currentSort === "low-to-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "high-to-low") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === "name") {
    filtered.sort((a, b) => a.model.localeCompare(b.model));
  }

  return filtered;
}

function renderProducts() {
  const products = getFilteredAndSortedProducts();

  cardsContainer.innerHTML = products
    .map(
      (element) => `
        <div class="card" data-brand="${element.brand}" data-model="${element.model}" data-price="${element.price}">
          <h2>${element.brand}</h2>
          <div class="image-container">
            
          <img src=${element.pic} alt="photo" >
          </div>
          <h3>${element.model}</h3>

          <p><strong>Price:</strong> ${formatCurrency(element.price)}</p>
          <p><strong>Color:</strong> ${element.color}</p>
          <p><strong>RAM:</strong> ${element.ram}</p>
          <p><strong>Storage:</strong> ${element.storage}</p>

          <div class="btn-container">
            <button>Buy Now</button>
            <button class="add-to-cart">Add to Cart</button>
          </div>
        </div>
      `,
    )
    .join("");

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function (event) {
      const card = event.target.closest(".card");
      addToCart(
        card.dataset.brand,
        card.dataset.model,
        Number(card.dataset.price),
      );
    });
  });
}

function addToCart(brand, model, price) {
  const existingItem = cart.find(
    (item) => item.brand === brand && item.model === model,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ brand, model, price, quantity: 1 });
  }

  renderCart();
}

function updateCartItem(item, change) {
  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(
      (cartItem) =>
        !(cartItem.brand === item.brand && cartItem.model === item.model),
    );
  }

  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart">Your cart is empty.</p>';
  } else {
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <div class="cart-item-info">
              <span>${item.brand} ${item.model}</span>
              <strong>${formatCurrency(item.price * item.quantity)}</strong>
            </div>
            <div class="item-controls">
              <button class="qty-btn decrease" data-brand="${item.brand}" data-model="${item.model}">-</button>
              <span>${item.quantity}</span>
              <button class="qty-btn increase" data-brand="${item.brand}" data-model="${item.model}">+</button>
              <button class="remove-btn" data-brand="${item.brand}" data-model="${item.model}">Remove</button>
            </div>
          </div>
        `,
      )
      .join("");
  }

  document.querySelectorAll(".qty-btn").forEach((button) => {
    button.addEventListener("click", function (event) {
      const brand = event.target.dataset.brand;
      const model = event.target.dataset.model;
      const cartItem = cart.find(
        (item) => item.brand === brand && item.model === model,
      );

      if (!cartItem) return;

      const delta = event.target.classList.contains("increase") ? 1 : -1;
      updateCartItem(cartItem, delta);
    });
  });

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", function (event) {
      const brand = event.target.dataset.brand;
      const model = event.target.dataset.model;
      cart = cart.filter(
        (item) => !(item.brand === brand && item.model === model),
      );
      renderCart();
    });
  });

  updateTotals();
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getShippingCost() {
  return cart.length === 0 ? 0 : cart.length * 149;
}

function getDiscountAmount() {
  if (!activeCoupon) return 0;

  const couponMap = {
    SAVE10: 0.1,
    SAVE20: 0.2,
    FREESHIP: 0.05,
  };

  const discountRate = couponMap[activeCoupon.toUpperCase()];
  if (discountRate === undefined) {
    return 0;
  }

  return getCartSubtotal() * discountRate;
}

function updateTotals() {
  const subtotal = getCartSubtotal();
  const shipping = getShippingCost();
  const discount = getDiscountAmount();
  const total = Math.max(subtotal + shipping - discount, 0);

  subtotalPrice.textContent = formatCurrency(subtotal);
  shippingPrice.textContent = formatCurrency(shipping);
  discountPrice.textContent = `-${formatCurrency(discount)}`;
  totalPrice.textContent = formatCurrency(total);
}

function applyCoupon() {
  const code = couponInput.value.trim();

  if (!code) {
    couponMessage.textContent = "Please enter a coupon code.";
    couponMessage.style.color = "#ef4444";
    activeCoupon = "";
    updateTotals();
    return;
  }

  const validCoupons = ["SAVE10", "SAVE20", "FREESHIP"];
  if (!validCoupons.includes(code.toUpperCase())) {
    couponMessage.textContent = "Invalid coupon code.";
    couponMessage.style.color = "#ef4444";
    activeCoupon = "";
    updateTotals();
    return;
  }

  activeCoupon = code.toUpperCase();
  couponMessage.textContent = `Coupon ${activeCoupon} applied successfully!`;
  couponMessage.style.color = "#16a34a";
  updateTotals();
}

function handleCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty. Add some products before checkout.");
    return;
  }

  alert(`Checkout complete! Total: ${totalPrice.textContent}`);
  cart = [];
  activeCoupon = "";
  couponInput.value = "";
  couponMessage.textContent = "";
  renderCart();
}

brandFilter.addEventListener("change", function (event) {
  currentFilter = event.target.value;
  renderProducts();
});

sortProducts.addEventListener("change", function (event) {
  currentSort = event.target.value;
  renderProducts();
});

document.getElementById("apply-coupon").addEventListener("click", applyCoupon);
checkoutBtn.addEventListener("click", handleCheckout);

const stylesheet = document.getElementById("theme");

document.querySelector(".dark").addEventListener("click", function () {
  if (stylesheet.getAttribute("href") === "style.css") {
    stylesheet.setAttribute("href", "dark.css");
  } else {
    stylesheet.setAttribute("href", "style.css");
  }
});

populateBrandFilter();
renderProducts();
renderCart();
