const socket = io();

let ulproductsRealTime=document.getElementById("productsRealTime")

socket.on("newProduct", (newproduct) => {
    console.log("Client is connected...");
    ulproductsRealTime.innerHTML+=`<li>${newproduct}</li>`
});
