const productsFromStorage = readFromStorage("products");
const adminNameContainer = document.getElementById("admin-name");
const adminName = localStorage.getItem("admin name");
adminNameContainer.textContent = adminName;
const categoriesArr = [];

// FILTER
function renderFilterBtns() {
  const btnsContainer = document.getElementById("buttons");
  btnsContainer.innerHTML = "";
  productsFromStorage.forEach((product) =>
    categoriesArr.push(product.category)
  );
  const uniqueCategoriesFromStorage = [...new Set(categoriesArr)];
  uniqueCategoriesFromStorage.forEach((category) => {
    btnsContainer.innerHTML += `
        <button class="button-value"> ${category}
          <img class="delete-btn" data-category="${category}" onclick="deleteCategory(event)" src="../../../assets/images/delete (4).png" alt="delete button">
        </button>
        `;
  });

  // ANOTHER WAY TO IMPLEMENT THE SAME LOGIC
  /* 
  const categoriesArr = [];
  productsFromStorage.forEach(product=> categoriesArr.push(product.category));
  const uniqueCategoriesFromStorage = [...new Set(categoriesArr)];
  uniqueCategoriesFromStorage.forEach(category=>{
      const btn = document.createElement("button");
      btn.setAttribute("class","button-value");
      btn.innerText = category;
      btn.addEventListener("click",()=> filterProduct(category));
      btnsContainer.append(btn);
  });
  */
}
renderFilterBtns();
function deleteCategory(e) {
  const newProductsArr = productsFromStorage.filter((product) => {
    return e.target.dataset.category !== product.category;
  });
  writeToStorage("products", newProductsArr);
  location.reload();
}

// HELPER FUNCTIONS
function readFromStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
function writeToStorage(key, value) {
  const valueStringify = JSON.stringify(value);
  localStorage.setItem(key, valueStringify);
}
