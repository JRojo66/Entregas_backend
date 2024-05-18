const socket = io();

let ulproductsRealTime=document.getElementById("updateProducts")

socket.on("newProduct", (newproduct) => {
    console.log("Client is connected...");
    ulproductsRealTime.innerHTML+=`<li>${newproduct}</li>`
});

socket.on("deletedProduct", products =>{
    ulproductsRealTime.innerHTML=""
    products.forEach(element => {
        ulproductsRealTime.innerHTML+=`<li>${element.title}</li>`
    });
});