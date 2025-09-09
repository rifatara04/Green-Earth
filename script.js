const spinner = document.getElementById('spinner');

// Modal
const loadNameDetails = async (id) => {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const data = await res.json();
    displayModal(data.plants);
}
const displayModal = (plant) => {
    const container = document.getElementById("detailes-container");
    container.innerHTML = `
  <h3 class="text-lg font-bold">${plant.name}</h3>
  <img class="rounded-lg w-full h-[300px]" src="${plant.image}" />
  <p class="font-bold"><span class="font-bold">Category:</span> ${plant.category}</p>
  <p class="font-bold"><span class="font-bold">Price:</span> ৳${plant.price}</p>
  <p><span class="font-bold">Description:</span> ${plant.description}</p>
  <div class="modal-action"><form method="dialog"><button class="btn">Close</button></form></div>`;
    document.getElementById("my_modal_5").showModal();
}

// Sidebar
const toggleMenu = async () => {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();
    displayMenu(data.categories);
}
const displayMenu = (categories) => {
    const container = document.getElementById("asaid-cointainer");
    container.innerHTML = "";

    //  All Trees
    const allLi = document.createElement("li");
    allLi.textContent = "All Trees";
    allLi.classList.add("active");
    allLi.onclick = async () => {
        document.querySelectorAll('#asaid-cointainer li').forEach(e => e.classList.remove("active"));
        allLi.classList.add("active");
        await allCategory();
    }
    container.appendChild(allLi);
    // other categories
    categories.forEach(cat => {
        const li = document.createElement("li");
        li.textContent = cat.category_name;
        li.onclick = async () => {
            document.querySelectorAll('#asaid-cointainer li').forEach(e => e.classList.remove("active"));
            li.classList.add("active");
            await loadTreeCard(cat.id);
        }
        container.appendChild(li);
    });
}




// Cards
const loadTreeCard = async (id) => {
    spinner.classList.remove("hidden");
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
    const data = await res.json();
    displayLoadTreeCard(data.plants);
    spinner.classList.add("hidden");
}

const allCategory = async () => {
    spinner.classList.remove("hidden");
    const res = await fetch(`https://openapi.programming-hero.com/api/plants`);
    const data = await res.json();
    displayLoadTreeCard(data.plants);
    spinner.classList.add("hidden");
}

const displayLoadTreeCard = (trees) => {
    const container = document.getElementById("card-cointainer");
    container.innerHTML = "";
    trees.forEach(tree => {
        const div = document.createElement("div");
        div.classList.add("tree-card", "bg-white", "p-4", "rounded-xl", "shadow-md");
        div.innerHTML = `
      <img src="${tree.image}" class="plant-img mb-2">
      <h1 onclick="loadNameDetails(${tree.id})" class="font-bold text-xl cursor-pointer tree-name">${tree.name}</h1>
      <p class="text-sm mb-2">${tree.description}</p>
      <div class="flex justify-between mb-2">
        <span class="bg-green-100 px-3 py-1 rounded-2xl text-green-800">${tree.category}</span>
        <span class="font-bold">৳<span class="tree-price">${tree.price}</span></span>
      </div>
      <button class="w-full bg-green-800 text-white py-2 rounded-3xl add-cart hover:bg-green-700">Add to Cart</button>
    `;
        container.appendChild(div);
    });
}

// Add to Cart
document.getElementById("card-cointainer").addEventListener("click", (e) => {
    if (e.target.classList.contains("add-cart")) {
        const card = e.target.closest(".tree-card");
        const name = card.querySelector(".tree-name").innerText;
        const price = parseFloat(card.querySelector(".tree-price").innerText);
        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const cart = document.getElementById("add-to-cart-main-section");

    const cartItem = document.createElement("div");
    alert(`"${name}" has been added to your cart`);
    cartItem.className = "cart-item flex justify-between items-center rounded-lg p-2 bg-green-50 mt-2";
    cartItem.innerHTML = `
      <div>
        <h1 class="font-bold">${name}</h1>
        <p>৳<span class="cart-item-price">${price}x1</span></p>
      </div>
      <button class="remove-btn">❌</button>`;

    cart.appendChild(cartItem);
    updateCartTotal();
}


// Remove from cart
document.getElementById("add-to-cart-main-section").addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
        e.target.closest(".cart-item").remove();
        updateCartTotal();
    }
});

// Update total tk
function updateCartTotal() {
    let total = 0;
    document.querySelectorAll(".cart-item").forEach(item => {
        total += parseFloat(item.querySelector(".cart-item-price").innerText);
    });
    document.getElementById("cart-total-price").innerText = total.toFixed(2);
}


toggleMenu();
allCategory();