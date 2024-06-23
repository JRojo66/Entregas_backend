
const checkout=async(cid)=>{

    let inputCarrito=document.getElementById("cartCheckout")
    cid=inputCarrito.value
    let payload=await fetch(`/api/cart/${cid}/purchase`,{
        method:"post"
    })
     if(payload.status===201){
         let data=await payload.json()
console.log(data);
         alert(`Checkout completed...!!! payload: ${data}`)
     }


}