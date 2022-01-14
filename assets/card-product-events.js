function reloadCart(quantity){
  let target = document.getElementById("cart-count-bubble")
  let counter = parseInt(target.childNodes[0].innerHTML)
  counter = counter + quantity
  target.childNodes[0].innerHTML = counter
}

let cart = new CartNotification()
let elements = document.getElementsByClassName("mini-grid")
for (const iterator of elements) {
  iterator.addEventListener("click", function(e){
  

    // Find Item ID
    let product_id = e.target.id
    
    // Add To Cart
    let formData = {
      'items': [{
       'id': product_id,
       'quantity': 1
       }],
       sections: "cart-items,cart-icon-bubble,cart-live-region-text,cart-footer"
     };
     fetch('/cart/add.js', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(formData)
     })
     .then(response => {
        if(response.ok) {
          cart.open()
          reloadCart(1)
          setTimeout(()=> {
            window.location = "/cart"
          }, 1500)
        
        } else {
          response.json()
          .then((data) => {
            alert(data.message + " " + data.description)
          })
        }
     })
     .catch((error) => {
       console.error('Error:', error);
     });

  })
}