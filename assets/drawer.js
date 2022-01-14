var drawer = function () {

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
  var settings = {
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
  var toggleccessibility = function (event) {
    if (event.getAttribute('aria-expanded') === 'true') {
      event.setAttribute('aria-expanded', false);
    } else {
      event.setAttribute('aria-expanded', true);
    }
  };

  // Open Drawer
  var openDrawer = function (trigger) {

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
    fetch('/cart.js')
    .then(response => response.json())
    .then(data => { 
        renderCart(data) 
    });

  };

  // Close Drawer
  var closeDrawer = function (event) {

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
  var clickHandler = function (event) {

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
  var keydownHandler = function (event) {

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

  var deleteProductCart = function(product_id) {
    
  } 

  var clearCart = function() {
    fetch("/cart/clear.js")
    .then(response => response.json())
    .then(data => { 
        closeDrawer()
    });
  }

  var renderCart = function(data) {
    let items = data.items
    console.log("render cart .......")
    
    let items_container = document.getElementById("drawer-items")
    
    // Clear cart
    items_container.innerHTML = ""

    // Render Items
    for (const item of items) {
      appendHtml(items_container, 
        ` <img src="${ item.image }" width="100%"  style="padding-left: 15% ; padding-right: 15%">
              
           <quantity-input class="quantity">
                  <button class="mini-cart-btn quantity__button no-js-hidden" name="minus" type="button" id="minus-${item.id}">
                          <span class="visually-hidden">Reducir cantidad para Camiseta</span>
                          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-minus" fill="none" viewBox="0 0 10 2">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z" fill="currentColor">
                </path></svg>

                        </button>
                        <input value="${item.quantity}" id="minus-${item.id}" class="quantity__input" type="number" name="quantity" min="1" value="1" form="product-form-template--15578804682977__main">
                        <button class="mini-cart-btn quantity__button no-js-hidden" name="plus" type="button">
                          <span class="visually-hidden">Aumentar cantidad para Camiseta</span>
                          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-plus" fill="none" viewBox="0 0 10 10">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z" fill="currentColor">
                </path></svg>

              </button>
            </quantity-input>

            <cart-remove-button id="Remove-1" data-index="1" id="delete-${item.id}" class="mini-cart-delete-btn">
                  <a class="button button--tertiary" aria-label="Eliminar Camiseta - Amarillo">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="{true}" focusable="false" role="presentation" class="icon icon-remove">
                    <path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"></path>
                    <path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"></path>
                  </svg>
                  </a>
              </cart-remove-button>  
          <h4>${ item.title }</h4>
        `)
    }

     // TOTAL 
    appendHtml(items_container, `<h3>Total: ${data.total_price}</h3>`)

    // ADD EVENT LISTENERS

    // BUTTONS
    let buttons = document.getElementsByClassName("mini-cart-btn")
    for (const button of buttons) {
        button.addEventListener("click", (e)=> {
          console.log(e.target.name)
          let product_id = e.target.id
          switch(e.target.name) {
            case "minus": 
              alert(product_id)
            break

            case "plus": 
              alert(product_id)
            break
          }
        })
    }

    // DELETE ITEM
    let delete_buttons = document.getElementsByClassName("mini-cart-delete-btn")
    for (const delete_button of delete_buttons) {
        delete_button.addEventListener("click", (e)=> {
            console.log(e.target)
        })
    }

    // CLEAR CART
    document.getElementById("mini-cart-clear-btn")
    .addEventListener("click", (e) => { clearCart() } )

  }

  var appendHtml = function(el, str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    while (div.children.length > 0) {
      el.appendChild(div.children[0]);
    }
  }


  //
  // Inits & Event Listeners
  //
  document.addEventListener('click', clickHandler, false);
  document.addEventListener('keydown', keydownHandler, false);
  
};

drawer();