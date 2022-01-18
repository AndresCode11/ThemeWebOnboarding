let drawer = function () {

  /**
  * Element.closest() polyfill
  * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
  */
  if (!Element.prototype.closest) {
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    Element.prototype.closest = function (s) {
      var el = this;
      var ancestor = this;
      if (!document.documentElement.contains(el)) return null;
      do {
        if (ancestor.matches(s)) return ancestor;
        ancestor = ancestor.parentElement;
      } while (ancestor !== null);
      return null;
    };
  }


  //
  // Settings
  //
  let settings = {
    speedOpen: 50,
    speedClose: 350,
    activeClass: 'is-active',
    visibleClass: 'is-visible',
    selectorTarget: '[data-drawer-target]',
    selectorTrigger: '[data-drawer-trigger]',
    selectorClose: '[data-drawer-close]',

  };


  //
  // Methods
  //

  // Toggle accessibility
  let toggleccessibility = function (event) {
    if (event.getAttribute('aria-expanded') === 'true') {
      event.setAttribute('aria-expanded', false);
    } else {
      event.setAttribute('aria-expanded', true);
    }
  };

  // Open Drawer
  let openDrawer = function (trigger) {

    // Find target
    var target = document.getElementById(trigger.getAttribute('aria-controls'));

    // Make it active
    target.classList.add(settings.activeClass);

    // Make body overflow hidden so it's not scrollable
    document.documentElement.style.overflow = 'hidden';

    // Toggle accessibility
    toggleccessibility(trigger);

    // Make it visible
    setTimeout(function () {
      target.classList.add(settings.visibleClass);
    }, settings.speedOpen);

    // Request 
    
    fetch('/cart?sections=drawer-items')
    .then(response => response.json())
    .then(data => { 
        renderCart(data['drawer-items']) 
    });

  };

  // Close Drawer
  let closeDrawer = function (event) {

    // Find target
    var closestParent = event.closest(settings.selectorTarget),
      childrenTrigger = document.querySelector('[aria-controls="' + closestParent.id + '"');

    // Make it not visible
    closestParent.classList.remove(settings.visibleClass);

    // Remove body overflow hidden
    document.documentElement.style.overflow = '';

    // Toggle accessibility
    toggleccessibility(childrenTrigger);

    // Make it not active
    setTimeout(function () {
      closestParent.classList.remove(settings.activeClass);
    }, settings.speedClose);

  };

  // Click Handler
  let clickHandler = function (event) {

    let currentDirectory = window.location.pathname
    switch(currentDirectory) {
      case '/cart' : return;
    }

    // Find elements
    var toggle = event.target,
      open = toggle.closest(settings.selectorTrigger),
      close = toggle.closest(settings.selectorClose);

    // Open drawer when the open button is clicked
    if (open) {
      openDrawer(open);
    }

    // Close drawer when the close button (or overlay area) is clicked
    if (close) {
      closeDrawer(close);
    }

    // Prevent default link behavior
    if (open || close) {
      event.preventDefault();
    }

  };

  // Keydown Handler, handle Escape button
  let keydownHandler = function (event) {

    if (event.key === 'Escape' || event.keyCode === 27) {

      // Find all possible drawers
      var drawers = document.querySelectorAll(settings.selectorTarget),
        i;

      // Find active drawers and close them when escape is clicked
      for (i = 0; i < drawers.length; ++i) {
        if (drawers[i].classList.contains(settings.activeClass)) {
          closeDrawer(drawers[i]);
        }
      }

    }

  };

  let deleteCart = (product_id, e) => {
    
    let formData = { quantity: 0 , id: product_id, sections: "drawer-items" }
    fetch("/cart/change.js", { method: "POST", body: JSON.stringify(formData), headers: { "Content-type": "application/json; charset=UTF-8"}})
    .then(response => response.json())
    .then(data => {
      renderCart(data.sections['drawer-items'])
    });
  } 

  let clearCart = () => {
    
    let formData = { sections: "drawer-items" }
    fetch("/cart/clear.js", { method: "POST", body: JSON.stringify(formData), headers: { "Content-type": "application/json; charset=UTF-8"}})
    .then(response => response.json())
    .then(data => {
      renderCart(data.sections['drawer-items'])
    });
  }

  let addCart = (product_id, quantity) => {
    
    let formData = { quantity , id: product_id, sections: "drawer-items" }

    fetch("/cart/change.js", { method: "POST", body: JSON.stringify(formData), headers: { "Content-type": "application/json; charset=UTF-8"}})
    .then(response => response.json())
    .then(data => { 
      renderCart(data.sections['drawer-items'])
    });
  }

  let minusCart = (product_id, quantity, e = null) => {

    let formData = { quantity , id: product_id, sections: "drawer-items" }
    
    fetch("/cart/change.js", { method: "POST", body: JSON.stringify(formData), headers: { "Content-type": "application/json; charset=UTF-8"}})
    .then(response => response.json())
    .then(data => { 
      renderCart(data.sections['drawer-items'])
    });
  
    
  }

  let renderCart = (data) => {
   
    let items_container = document.getElementById("drawer-items")
    items_container.innerHTML = data
    // ADD EVENT LISTENERS

    // BUTTONS
    let buttons = document.getElementsByClassName("mini-cart-btn")
    for (const button of buttons) {
        button.addEventListener("click", (e)=> {
          console.log(e.target.name)
          let product_id = e.target.id.replace("minus-", "").replace("plus-", "")
          let currentValue = document.getElementById(`input-${product_id}`).value
          switch(e.target.name) {
            case "minus": 
              minusCart(product_id, currentValue, e)
            
            break

            case "plus": 
              addCart(product_id, currentValue)
              
            break
          }
        })
    }

    // DELETE ITEM
    let delete_buttons = document.getElementsByClassName("mini-cart-delete-btn")
    for (const delete_button of delete_buttons) {
        delete_button.addEventListener("click", (e)=> {
          let product_id = e.target.id.replace("delete-", "")
          deleteCart(product_id, e)
         
        })
    }

    // CLEAR CART
    document.getElementById("mini-cart-clear-btn")
    .addEventListener("click", (e) => { 
        clearCart() 
    })

  }

  //
  // Inits & Event Listeners
  //
  document.addEventListener('click', clickHandler, false);
  document.addEventListener('keydown', keydownHandler, false);
  
};

drawer();