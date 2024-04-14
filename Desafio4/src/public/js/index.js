let nombre = prompt("Ingrese su nombre");
document.title=nombre
const socket = io();
socket.on("saludo", texto=>{
    console.log(texto);
    if(nombre){
        socket.emit("id",nombre)
    }
})

socket.on("nuevoUsuario", user=>{
    console.log(`${user} has joined`)
})

const decir=(texto)=>{
    socket.emit("nuevoMensaje",nombre, texto)
}

socket.on("mensaje",(nombre, mensaje)=>{
    console.log(`${nombre} says ${mensaje}`);
});

let parrafoTemperatura=document.getElementById("temperatura")
socket.on("nuevaLecturaNuevaTemperatura", temperatura=>{
    parrafoTemperatura.innerHTML=`La temperatura actual es de ${temperatura}°C`
})

