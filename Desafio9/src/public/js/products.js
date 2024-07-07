const buy=async(pid)=>{
    let inputCarrito=document.getElementById("cart")
     let cid=inputCarrito.value
     let payload=await fetch(`/api/cart/${cid}/product/${pid}`,{
         method:"post"
     })
      if(payload.status===200){
          let data=await payload.json()
          alert("Product added...!!!")
      }
}
