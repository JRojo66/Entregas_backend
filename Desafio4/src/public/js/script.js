const socket = io();

const productListElement = document.getElementById("productList"); // Assuming you have an element with this id

socket.on("newProduct", (productList) => {
  console.log(`New product list received: `, productList);

  // Clear existing content
  productListElement.innerHTML = "";

  // Loop through the entire product list and create new elements
  productList.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("container");

    const productRow = document.createElement("div");
    productRow.classList.add("row");

    const productCol = document.createElement("div");
    productCol.classList.add("col", "mx-1");

    const productCard = document.createElement("div");
    productCard.classList.add("card", "w-75");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const productTitle = document.createElement("h5");
    productTitle.classList.add("card-title");
    productTitle.textContent = product.title;

    const productImage = document.createElement("img");
    productImage.classList.add("card-img-top");
    productImage.src = product.thumbnails[0];
    productImage.alt = product.title;

    const productDescription = document.createElement("p");
    productDescription.classList.add("card-text");
    productDescription.textContent = product.description;

    const productPrice = document.createElement("p");
    productPrice.classList.add("card-text");
    productPrice.textContent = `$ ${product.price}`;

    cardBody.appendChild(productTitle);
    cardBody.appendChild(productImage);
    cardBody.appendChild(productDescription);
    cardBody.appendChild(productPrice);

    productCard.appendChild(cardBody);
    productCol.appendChild(productCard);
    productRow.appendChild(productCol);
    productItem.appendChild(productRow);

    productListElement.appendChild(productItem);
  });
});