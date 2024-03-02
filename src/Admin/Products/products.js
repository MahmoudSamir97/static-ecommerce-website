const products = readFromStorage("products");
const id = document.getElementById("productId");
const title = document.getElementById("title");
const category = document.getElementById("category");
const description = document.getElementById("description");
const price = document.getElementById("price");
const imageInput = document.getElementById("image");
const submitBtn = document.getElementById("submit");
const manualProductsArr = [
    {
        id: 51,
        title: "LISTERINE Mouthwash, Cool Mint, 250ml",
        price: 20.02,
        description: "Brushing only reaches 25% of your mouth, and the germs left behind after brushing double every 1-2 hours. Listerine",
        category: "Health",
        image: "./images/listerine.jpg"
    },
    {
        id: 52,
        title: "Haj Arafa Moroccan Clay 300 g",
        price: 5.02,
        description: "Haj Arafa Moroccan Clay has ability to draw out impurities and toxins from the skin . Moroccan clay is an eco-friendly and cruelty-free choice",
        category: "Health",
        image: "./images/hajArafa.jpg"
    },
    {
        id: 53,
        title: "Centrum with Lutein, A to Zinc supplements for Adults",
        price: 5.02,
        description: "Centrum Adults is a daily multivitamin supplement packed with essential nutrients to respond to body’s needs and nourish health.* Its high-quality ingredients are backed by 40 years of nutritional science from the #1 multivitamin brand. Formulated with 26 key vitamins & minerals to help support daily energy levels, support normal immune function, and assist in the body’s metabolism of macronutrients.** *This statement has not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. ** B vitamins support daily energy needs. Vitamins C and E support normal immune function. B vitamins aid in the metabolism of fats, carbohydrates, and proteins.",
        category: "Health",
        image: "./images/centrum.jpg"     
    },
    {
        id: 54,
        title: "Samsung Refrigerator RT40A3310SA/MR 396L",
        price: 150.02,
        description: "Samsung Refrigerator RT40A3310SA/MR 396L - Metal Graphite The Digital Inverter Compressor automatically adjusts its speed in response to cooling requirements. The Power Cool feature releases intensely cold air into the refrigerator to cool your favorite food and drink.",
        category: "Appliances",
        image: "./images/1.jpg"     
    },
    {
        id: 55,
        title: "Panasonic Water Purifier With a filtration rate of 6 liters per minute",
        price: 5.02,
        description: "This Panasonic Water Purifier connects directly to a kitchen faucet to provide clean, filtered water for cooking and drinking purposes. If it is not practical to install a full-scale water filtration system in your home, this is a practical, cost-effective solution. With a filtration rate of 6 liters per minute and a long-lasting activated carbon filter, this water purifier effectively removes chlorine residue and other impurities in the water supply. Water must be boiled before drinking.",
        category: "Appliances",
        image: "./images/2.jpg"     
    },
    {
        id: 56,
        title: "Sokany SK-4001 800W Electric Juicer",
        price: 5.02,
        description: "Sokany SK-4001 800W Electric Juicer is a mid-powered juicer with an 800-watt motor for efficient juicing, capable of extracting juice from a variety of fruits and vegetables. It offers a higher power output than basic models for faster processing, equipped with multiple speed settings for different produce types. It features a larger capacity for juicing compared to lower-powered options, represents a balance between power and versatility for home juicing needs. Suitable for regular use and handling a wider range of ingredients, easy to assemble, operate and clean after juicing sessions. Provides efficient juicing performance for various fruits and veggies.",
        category: "Appliances",
        image: "./images/3.jpg"     
    }
];

// add products to customer page
// pushToApiData(manualProductsArr);

function renderAdminName(){
    const adminNameContainer = document.getElementById("admin-name");
    const adminName = localStorage.getItem("admin name");
    adminNameContainer.textContent = adminName;
};
const getData = async ()=>{
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    return data;
};
function pushToApiData(arr){
    arr.forEach(productM=>{
        const isFound = products.find(product=>{
            return  product.id === productM.id
          });
          if(!isFound){
            products.push(productM);
            writeToStorage("products", products);
        };
    });
};



function onstart(){
    displayProducts();
    renderAdminName();
}
function displayProducts(){
const productsContainer = document.getElementById("main-container");
for (const product of products){
    productsContainer.innerHTML += `
        <div class="single-product" data-id="${product.id}">
            <div class="icons-container"> 
                <img src="../images/dashboardimages/icons8-update-48.png" onclick="updateProduct(event)" alt="add icon" id="update-btn">
                <img src="../images/dashboardimages/icons8-delete-64.png" onclick="deleteProduct(event)" alt="eye icon" id="delete-btn">
            </div>
            <div class="product-img-container">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <p class="product-category">${product.category}</p>
            <p class="product-title">${product.title}</p>
            <p class="product-price">$ ${product.price}</p>
        </div>
`;
    } 
};

// event handler function on Dom element
function updateProduct(e){
    products.forEach(product => {
        if (product.id == e.target.parentElement.parentElement.dataset.id){
            const index = products.indexOf(product);
            id.value = product.id;
            title.value = product.title;
            category.value = product.category;
            description.value = product.description;
            imageInput.value = product.image;
            price.value = product.price;
            products.splice(index,1);
            writeToStorage("products", products);
        }
    });
};
function deleteProduct(e){
    products.forEach(product => {
        if (product.id == e.target.parentElement.parentElement.dataset.id){
            const index = products.indexOf(product);
            products.splice(index,1);
            writeToStorage("products",products); 
            location.reload();
        }
    });
};
submitBtn.addEventListener("click", ()=>{
    const editProduct = {
        id: parseInt(id.value),
        title: title.value,
        price: price.value,
        description: description.value,
        category: category.value,
        image: imageInput.value   
    };
    products.push( editProduct);
    writeToStorage("products", products);
    location.reload()
})

// helper function
function readFromStorage(key){
    return JSON.parse(localStorage.getItem(key)); 
};
function writeToStorage(key,value){
  const  valueStringify =  JSON.stringify(value);
  localStorage.setItem(key, valueStringify);
};

const resetData = async ()=>{
    const dataArr = await getData();
    writeToStorage("products", dataArr);
};
// resetData();
window.addEventListener("DOMContentLoaded", onstart);




