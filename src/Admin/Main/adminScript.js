const confirmBtn = document.querySelector(".confirm-btn");
const rejectBtn = document.querySelector(".reject-btn");
const mainContainer = document.querySelector(".main-container");
const orderContainer = document.getElementById("orders-container");
const adminNameContainer = document.getElementById("admin-name");
const userNameContainer = document.getElementById("user-name");
const adminName = localStorage.getItem("admin name");
const username = localStorage.getItem("user name");
const pendingItemsFromStorageRaw = localStorage.getItem("pending items");
const pendingItemsFromStorage = pendingItemsFromStorageRaw
  ? JSON.parse(pendingItemsFromStorageRaw)
  : [];
adminNameContainer.textContent = adminName;
userNameContainer.textContent = username;

// STYLE NAVBAR WITH SCROLL
window.onscroll = function () {
  const nav = document.querySelector("nav");
  if (window.scrollY >= 20) {
    nav.style.backgroundColor = "#fff";
  } else {
    nav.style.backgroundColor = "#F5E6E0";
  }
};

const renderPendingOrders = () => {
  if (pendingItemsFromStorage.length > 0) {
    mainContainer.style.visibility = "visible";
    pendingItemsFromStorage.forEach((item) => {
      orderContainer.innerHTML += `
          <tr>
              <td class="center">${item.id}</td>
              <td>${item.title}</td>
              <td><img class="order-img" src="${item.image}" alt="order image"></td>
              <td>$ ${item.price}</td>
              <td class="center">${item.quantity}</td>
          </tr>
          `;
    });
  }
};

confirmBtn.addEventListener("click", () => {
  localStorage.setItem("order status", "confirmed");
});
rejectBtn.addEventListener("click", () => {
  localStorage.setItem("order status", "rejected");
});

renderPendingOrders();
