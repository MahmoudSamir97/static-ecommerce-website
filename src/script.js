// DOM MANIPULATIONS
const cartLogoBtn = document.getElementById("cart-logo");
const mainPageIcon = document.querySelector(".main-page");
const backArrowBtns = document.querySelectorAll(".backArrow");
const cartContainer = document.querySelector(".cart");
const wishListIcon = document.querySelector(".wish-list-icon");
const cartItemsContainer = document.querySelector(".cart-items-container");
const pendingItems = JSON.parse(localStorage.getItem("pending items"));
const wishListContainer = document.querySelector(".wish-list-container");
const productsContainer = document.getElementById("main-container");
const productDescContainer = document.querySelector(".product-description");
const btnsContainer = document.querySelector(".btns-container");
const statusHolder = document.querySelector(".view-status");
const productsFromStorage = readFromLocalStorage("products");
const saveWishesBtn = document.querySelector(".button-1");

// SET INITIAL VALUES
let cartItems = [];
let wishesFromCookieArray = getCookie("wishlist") || [];
statusHolder.textContent = localStorage.getItem("order status");

// CHANGE NAVBAR STYLES
window.onscroll = function () {
  const nav = document.querySelector("nav");
  if (window.scrollY >= 20) {
    nav.style.backgroundColor = "#fff";
  } else {
    nav.style.backgroundColor = "";
  }
};

// SHOW-HIDE CART/FAVOURITE
cartLogoBtn.addEventListener("click", () => {
  cartContainer.style.display = "block";
});
backArrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    cartContainer.style.display = "none";
    wishListContainer.style.display = "none";
  });
});
wishListIcon.addEventListener("click", () => {
  wishListContainer.style.display = "block";
});

// FILTER
function renderFilterBtns() {
  const btnsContainer = document.getElementById("buttons");
  btnsContainer.innerHTML = "";
  const categoriesArr = [];
  productsFromStorage.forEach((product) =>
    categoriesArr.push(product.category)
  );
  const uniqueCategoriesFromStorage = [...new Set(categoriesArr)];
  uniqueCategoriesFromStorage.forEach((category) => {
    const btn = document.createElement("button");
    btn.setAttribute("class", "button-value");
    btn.innerText = category;
    btn.addEventListener("click", () => filterProduct(category));
    btnsContainer.append(btn);
  });
}

function filterProduct(category) {
  const filteredArr = productsFromStorage.filter((product) => {
    return product.category == category;
  });
  renderProducts(filteredArr);
  attacheventHandler();
}

// SHOW PRODUCTS
mainPageIcon.addEventListener("click", () => {
  productDescContainer.style.display = "none";
  productsContainer.style.display = "grid";
  btnsContainer.style.display = "flex";
});

// MAIN FUNCTION
const displayOnPage = () => {
  renderProducts(productsFromStorage);
  renderFilterBtns();
  attacheventHandler();
  removeAllFromCart();
  renderUserName();
  renderCartItems(pendingItems);
  calcTotal(pendingItems);
  updateWishList(wishesFromCookieArray);
};

// CART
function updateCartDisplay() {
  renderCartItems(cartItems);
  calcTotal(cartItems);
  // increasing and decreasing when clicking on add and minus btn beside item in cart
  const minusBtns = document.querySelectorAll(".minus_btn");
  const addBtns = document.querySelectorAll(".add_btn");
  minusBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      cartItems.forEach((item) => {
        if (parseInt(e.target.dataset.id) === item.id) {
          const index = cartItems.indexOf(item);
          item.quantity--;
          if (item.quantity <= 0) {
            cartItems.splice(index, 1);
          }
        }
        updateCartDisplay();
      });
    });
  });
  addBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      cartItems.forEach((item) => {
        if (parseInt(e.target.dataset.id) === item.id) {
          item.quantity++;
        }
        updateCartDisplay();
      });
    });
  });

  // DELETE FROM CART
  const deleteBtns = document.querySelectorAll(".close-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      cartItems.forEach((item) => {
        if (parseInt(e.target.dataset.id) === item.id) {
          const index = cartItems.indexOf(item);
          cartItems.splice(index, 1);
        }
        updateCartDisplay();
      });
    });
  });
}

function removeAllFromCart() {
  const rubbishIcon = document.querySelector(".rubbish-icon");
  rubbishIcon.addEventListener("click", () => {
    cartItems = [];
    updateCartDisplay();
  });
}

//  Helper Functions

// RENDER PRODUCTS
function renderProducts(arr) {
  productsContainer.innerHTML = "";
  for (const product of arr) {
    productsContainer.innerHTML += `
                <div class="single-product" data-id="${product.id}">
                    <div class="icons-container">
                        <img src="../assets/images/icons8-add-50.png" alt="add icon" id="add-btn">
                        <img src="../assets/images/eye (1).png" alt="eye icon" id="eye-btn">
                    </div>
                    <img src="../assets/images/wish-list.png" alt="like the product" class="like-btn" onclick="addToWishList(event)">
                    <div class="product-img-container">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <p class="product-category">${product.category}</p>
                    <p class="product-title">${product.title}</p>
                    <p class="product-price">$ ${product.price}</p>
                </div>
            `;
  }
}

function renderCartItems(arr) {
  const countHolder = document.getElementById("count");
  countHolder.textContent = arr.length;
  cartItemsContainer.innerHTML = "";
  arr.forEach((item) => {
    cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div class="img-container">
                    <img src="${item.image}" alt="item photo">
                </div>
                <div class="item-info">
                    <p class="item-title">${item.title}</p>
                    <div class="item-number-price">
                        <div class="item-count">
                            <img src="../assets/images/minus-sign.png" alt="minus" data-id="${
                              item.id
                            }" class="minus_btn btn">
                            <p id="numberOfItems">${item.quantity}</p>
                            <img src="../assets/images/add.png" alt="add button"  data-id="${
                              item.id
                            }" class="add_btn btn">
                        </div>
                        <p class="item-price">$${item.price}</p>
                    </div>
                </div>
                <div class="lst-col">
                    <img src="../assets/images/close.png" alt="close cart" data-id="${
                      item.id
                    }" class="close-btn">
                    <p class="totalOfItem">$ <span id="itemTotal">${(
                      item.price * item.quantity
                    ).toFixed(2)}</span> </p>
                </div>
        </div>
        `;
  });
}
// add and eye icon handler function
async function attacheventHandler() {
  // add icon (+)
  const addBtns = document.querySelectorAll("#add-btn");
  for (let i = 0; i < addBtns.length; i++) {
    addBtns[i].addEventListener("click", addToCart);
    function addToCart(e) {
      const currentelement = e.target.parentElement.parentElement;
      const currentelementId = parseInt(currentelement.getAttribute("data-id"));
      const targetElementInArray = productsFromStorage.find(
        (element) => element.id === currentelementId
      );
      const existInCartItems = cartItems.find(
        (item) => item.id === targetElementInArray.id
      );
      if (existInCartItems) {
        existInCartItems.quantity++;
      } else {
        cartItems.push({ ...targetElementInArray, quantity: 1 });
      }
      updateCartDisplay();
    }
  }
  // PRODUCT DESCRIPTION
  const eyeBtns = document.querySelectorAll("#eye-btn");
  eyeBtns.forEach((btn) => {
    btn.addEventListener("click", showingTheCart);
  });
  function showingTheCart(e) {
    btnsContainer.style.display = "none";
    productDescContainer.innerHTML = "";
    productDescContainer.style.display = "flex";
    productsContainer.style.display = "none";
    const currentelement = e.target.parentElement.parentElement;
    const targetProduct = productsFromStorage.find(
      (product) =>
        product.id === parseInt(currentelement.getAttribute("data-id"))
    );
    productDescContainer.innerHTML = `
            <div class="desc-image-container">
                <img src="${targetProduct.image}" alt="product image">
            </div>
            <div class="info-container">
                <h1 class="desc-product-title">${targetProduct.title}</h1>
                <p class="desc-product-price">$ ${targetProduct.price}</p>
                <p class="desc-product-description">${targetProduct.description}</p>
                <button class="desc-product-AddButton" data-id="${targetProduct.id}">Add to cart</button>
            </div>
    `;
    const addFromDesc = document.querySelector(".desc-product-AddButton");
    addFromDesc.addEventListener("click", (e) => {
      const targetElemId = parseInt(e.target.dataset.id);
      const targetElemInArray = productsFromStorage.find(
        (product) => product.id === targetElemId
      );
      const existInCartItems = cartItems.find(
        (item) => item.id === targetElemInArray.id
      );
      if (existInCartItems) {
        existInCartItems.quantity++;
      } else {
        cartItems.push({ ...targetElemInArray, quantity: 1 });
      }
      updateCartDisplay();
    });
  }
}

// TOTAL PRICE OF CART
function calcTotal(arr) {
  const totalHolder = document.getElementById("total_count");
  const value = arr.reduce((accumulator, current) => {
    return accumulator + current.price * current.quantity;
  }, 0);
  totalHolder.innerText = value.toFixed(2);
}

// LOGIN HANDLER
function renderUserName() {
  const userNameFromStorage = localStorage.getItem("user name");
  const userNameContainer = document.getElementById("user_name");
  userNameContainer.textContent = userNameFromStorage;
  const logOutBtn = document.querySelector(".log-out-btn");
  logOutBtn.addEventListener("click", () => {
    window.location.href = "Login/login.html";
  });
}

function addToWishList(e) {
  const ClickedElementDataId = parseInt(e.target.parentElement.dataset.id);
  const targetObjInArr = productsFromStorage.find(
    (obj) => obj.id === ClickedElementDataId
  );
  const existInWishList = wishesFromCookieArray.find(
    (obj) => obj.id === targetObjInArr.id
  );
  if (!existInWishList) {
    wishesFromCookieArray.push(targetObjInArr);
  }
  updateWishList(wishesFromCookieArray);
}

function updateWishList(wishArr) {
  const itemsContainer = document.querySelector(".wish-list-items");
  const countHolder = document.getElementById("wish-list-count");
  countHolder.textContent = wishArr.length;
  itemsContainer.innerHTML = "";
  wishArr.forEach((item) => {
    itemsContainer.innerHTML += `
        <div class="cart-item">
        <div class="img-container">
            <img src="${item.image}" alt="item photo">
        </div>
        <div class="item-info">
            <p class="item-title">${item.title}</p>
            <div class="item-number-price">
            <p class="item-price">$${item.price}</p>
            </div>
        </div>
        <div class="lst-col">
            <img src="../assets/images/close.png" alt="close cart" data-id="${item.id}" class="close-btn close-wish" onclick="deleteWish(event)">
        </div>
        </div>
        `;
  });
}
const orderBtn = document.querySelector(".check-out");
orderBtn.addEventListener("click", () => {
  if (cartItems.length == 0) {
    localStorage.setItem("pending items", null);
    localStorage.setItem("order status", "Unordered");
  } else {
    localStorage.setItem("pending items", JSON.stringify(cartItems));
    localStorage.setItem("order status", "Pending...");
    statusHolder.textContent = localStorage.getItem("order status");
  }
});
saveWishesBtn.addEventListener("click", () => {
  const stringifiedWishes = JSON.stringify(wishesFromCookieArray);
  setCookie("wishlist", stringifiedWishes, 1000);
});

function deleteWish(e) {
  wishesFromCookieArray.forEach((item) => {
    if (parseInt(e.target.dataset.id) === item.id) {
      const index = wishesFromCookieArray.indexOf(item);
      wishesFromCookieArray.splice(index, 1);
    }
    updateWishList(wishesFromCookieArray);
  });
}

// READ-WRITE TO LOCAL STORAGE
function readFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
function writeToLocalStorage(key, value) {
  const jsonString = JSON.stringify(value);
  localStorage.setItem(key, jsonString);
}

// READ-WRITE COOKIE
const setCookie = (cname, cvalue, expDays) => {
  let d = new Date();
  d.setTime(d.getTime() + expDays * 24 * 60 * 60 * 1000);
  let expire = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expire};path=/`;
};

function getCookie(cname) {
  let cookieValues = document.cookie
    .split(";")
    .map((ele) => ele.split("="))
    .reduce((accumulator, [key, value]) => {
      accumulator[key.trim()] = value;
      return accumulator;
    }, {});
  if (!cookieValues[cname]) return null;
  return JSON.parse(cookieValues[cname]);
}

// EXECUTE displayOnPage() WHEN PAGE LOADED SUCCESSFULLY
window.addEventListener("DOMContentLoaded", displayOnPage());
