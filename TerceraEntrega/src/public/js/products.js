const buy=async(pid)=>{
    let inputCarrito=document.getElementById("cart")
     console.log("xxx");                                                              // Borrar
     console.log("inputCarrito: ",inputCarrito);                                                       // Borrar
     console.log("xxxxxx");                                                           // Borrar
     let cid=inputCarrito.value
     console.log(`Codigo producto: ${pid}, Codigo Carrito: ${cid}`)                   // Borrar
     let respuesta=await fetch(`/api/cart/${cid}/product/${pid}`,{
         method:"post"
     })
      if(respuesta.status===200){
          let datos=await respuesta.json()
          console.log(datos)
          alert("Producto agregado...!!!")
      }
}
