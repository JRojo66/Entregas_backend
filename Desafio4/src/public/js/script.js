const socket = io();
socket.on("saludo", texto=>{
    console.log(texto);
})
socket.on("nuevoUsuario", user=>{
    console.log(`${user} has joined`)
})
