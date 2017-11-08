var productInfo;

var navMenu;
var products = [];
var cart = [];
var inactiveTime = 0;
var totalCost = 0;
var url = '';
const XHR_COUNT_LIMIT = 5;
const XHR_TIMEOUT = 5000; // in ms
var productsXhrReqCount = 0;


var serverProducts = [];
var priceSyncStatus = 0;
var quantitySyncStatus = 0;


/**
 * Constructor for product object
 *
 * @param name: name of product
 * @param price: price of product
 * @param imageUrl: url to retrieve image
 * @param quantity: initial quantity
 */

var Product = function (name, price, imageUrl, quantity) {
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;
    this.quantity = quantity;
};


/**
 * Computes the total price given the quantity of the product
 *
 * @param quantity: quantity of an object in cart
 * @returns {number} price
 */
Product.prototype.computeNetPrice = function (quantity) {
    return this.price * quantity;
};


/**
 * Logs the error message (of the request to load the navigation menu) on the console
 *
 * @param errMsg: the response from the xmlHttp request
 */
function navMenuServerError(errMsg) {
    console.warn('Error while fetching navigation menu list from the server. \nError Message: ' + errMsg);
}

/**
 * Logs the error message (of the request to load the products list) on the console
 *
 * @param req: request variable
 * @param url: the url of the request
 * @param msg: the response of the request
 */
function productListServerError(req, url, msg) {
    if ((req.readyState === 4) && ++productsXhrReqCount <= XHR_COUNT_LIMIT) {
        console.log(msg + '\nRequesting Again! # of repeats: ' + productsXhrReqCount);
        req.open('Get', url);
        req.send();
    } else if (productsXhrReqCount > XHR_COUNT_LIMIT) {
        console.log('Request #: ' + productsXhrReqCount + 'Exceded max req limit. To increase limit, change XHR_COUNT_LIMIT');
        productsXhrReqCount = 0;
    }


}

/*===============================================================================*/


/**
 * Makes the AJAX request as per the Assignment specifications
 *
 * @param url: url to make request to
 * @param successCallback: function to call on successful request
 * @param errorCallback:   function to call when request fails
 */

var ajaxGet = function (url, successCallback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
        if (xhr.status === 200)
            successCallback(xhr.response);
        else if (xhr.status === 500)
            errorCallback(xhr, url, '500 status!');
    };
    xhr.onerror = errorCallback(xhr, url, 'xhr.onerror problem!');
    xhr.onabort = function () {
        console.log('Request Aborted');
    };
    xhr.ontimeout = function () {
        var msg = XHR_TIMEOUT + 'ms timout';
        errorCallback(xhr, url, msg);
    };
    xhr.timeout = XHR_TIMEOUT; // Wait at most 5000 ms for a response
    console.log("Sending request: " + xhr);
    xhr.send(null);
};

/**
 * Function where we initialise the products
 *
 * initialize function: initialise the products
 */
function init() {

    var isMyServer = false; // false for assignments
    const DEV_MSG = 'IMPORTANT: Please run the command "npm install" and then "heroku local web" in the source directory';
    const CPEN_URL = 'https://cpen400a-bookstore.herokuapp.com';

    if (!isMyServer) {
        url = CPEN_URL;
    }

    // initial message in developer console
    console.log(DEV_MSG);


    // GET requests to my server
    ajaxGet('/navMenuList', navMenuController, navMenuServerError);

    // GET requests to cpen server
    ajaxGet(url + '/products', productListController, productListServerError);

}

init();

document.getElementById('showCartButton').onclick = showCart;
window.onload = startTimer;

/*
 * MVC design pattern
 * This design pattern makes sure there is no direct connection between
 * model(app data) and the view (rendered content/ DOM)
 * This allows the ease of changing model/view without affecting the other
 */









/*
 * MODEL
 */

/**
 * Resets the inactivity period for the webpage
 */
function resetTimer() {
    inactiveTime = 0;
}


/**
 * Timer to alert the user after a period of inactivity
 */
function startTimer() {
    if (inactiveTime >= 30) {
           alert("Hey there! Are you still planning to buy something?");
        resetTimer();
        startTimer();
    } else {
        setTimeout(function () {
            var inactiveTimeDisplay = document.getElementById("inactiveTimeDisplay");
            inactiveTimeDisplay.innerHTML = ++inactiveTime + " seconds";
            startTimer();
        }, 1000);
    }
}




/**
 * Adds a product to the products variable
 *
 * @param name: name of product
 * @param quantity: quantitiy of product
 * @param cost: price of product
 */
function addProduct(name, quantity, cost) {
    var imageURL = url + '/images/' + name + '.png';
    products[name] = {
        product: new Product(name, cost, imageURL, quantity)
    }
}


/**
 * Parses a JSON string
 *
 * @param navMenuList: the list of items in the navigation menu
 * @returns {*}
 */
function setNavMenu(navMenuList) {
    navMenu = JSON.parse(navMenuList);
    return navMenu;
}



/**
 * Initialises the products list by adding products to it
 *
 * @return {Array}
 * @param productList: list of prodducts
 */
function initializeProductList(productList) {
    // console.log(productList);
    productInfo = JSON.parse(productList);

    for (var name in productInfo) {
        addProduct(productInfo[name].name, productInfo[name].quantity, productInfo[name].price);
    }

    return products;
}



/**
 * Determines whether a product is in the cart or not
 *
 * @param pName: name of product
 * @return {boolean}
 */
function productInCart(pName) {
    return !(cart[pName] === undefined);
}




/**
 * Updates the cost of a cart
 */

function updateCartCost() {
    var keys = Object.keys(cart);
    totalCost = 0;
    for (var i = 0; i < keys.length; i++) {
        var pName = keys[i];
        var pQuantity = cart[pName];
        var pPrice = products[pName].product.price;

        console.log('name: ' + pName + 'pQuant: ' + pQuantity + 'pPrice: ' + pPrice);
        totalCost += pPrice * pQuantity;
    }

    renderCartCost();
}


/*
 * CONTROLLER
 */


/**
 * Adds the product to cart
 *
 * @param productName
 */
function addToCart(productName) {
    resetTimer();
    showRemoveButton(productName);
    if (products[productName].product.quantity <= 0) {
        // out of stock
        alert(productName + ' Out of Stock!');
        hideAddButton(productName);
        showOutOfStockButton(productName);

    } else {
        if (!productInCart(productName)) {
            //TODO: move this to model
            cart[productName] = 0;
        }
        --products[productName].product.quantity;
        ++cart[productName];
    }
    updateCartCost();


}

/**
 * Removes the product from cart
 *
 * @param productName: name of product
 */
function removeFromCart(productName) {
    resetTimer();
    showAddButton(productName);
    hideOutOfStockButton(productName);
    if (!productInCart(productName)) {
        // already 0!
        alert(productName + ' does not exist in the cart!');
    } else {
        ++products[productName].product.quantity;
        if (--cart[productName] === 0) {
            hideRemoveButton(productName);
            //TODO: move this to model
            delete cart[productName];
        }
    }

    updateCartCost();
}



/**
 * Adds products to a new list. This is the updated list when we click checkout
 *
 * @param name: name of product
 * @param quantity: quantity of product
 * @param cost: cost of product
 */
function addServerList(name, quantity, cost) {
    var imageURL = url + '/images/' + name + '.png';
    serverProducts[name] = {
        product: new Product(name, cost, imageURL, quantity)
    }
}



/**
 * Checks whether the price of products in cart is in sync with the server
 * 
 * @param array
 */
function checkPriceSync(array) {
    for (var e in array) {
        if (serverProducts[e].product.price === products[e].product.price) {
            console.log(serverProducts[e].product.price);
            priceSyncStatus = 1;
            console.log("The price of " + products[e].product.name + " IS SAME " + products[e].product.price + " to " + serverProducts[e].product.price);
        } else {
            priceSyncStatus = 0;
            confirm("The price of " + products[e].product.name + " changed from $" + products[e].product.price + " to $" + serverProducts[e].product.price + ". Proceed?");
            products[e].product.price = serverProducts[e].product.price;
            console.log("The quantity is " + array[e]);
            products[e].product.computeNetPrice(array[e]);
            renderCartCost();
            showCart();
        }
    }
}



/**
 * Checks whether there is enough of a product in stock to satisfy the cart amount
 *
 * @param array
 */
function checkQuantitySync(array) {
    for (var e in array) {
        if (array[e] <= serverProducts[e].product.quantity) {
            quantitySyncStatus = 1;
            console.log(" :) :) The quantity of " + products[e].product.name + " in cart is  " + array[e] + " and in server is  " + serverProducts[e].product.quantity);
        } else if (serverProducts[e].product.quantity === 0) {
            removeFromCart(serverProducts[e].product.name);
            console.log("We removed " + serverProducts[e].product.name + " from cart");
        } else {
            quantitySyncStatus = 0;
            alert("Sorry :( :( The quantity of " + products[e].product.name + " in cart is  " + array[e] + " but availability is  " + serverProducts[e].product.quantity);
        }
    }
}


/**
 * Checks synchronisation of price and quantity
 *
 * @param array
 */
function clientSync(array) {

    checkPriceSync(array);
    checkQuantitySync(array);


}


/**
 * Initialises the updated list from the server
 *
 * @param list
 */
function initServerProducts(list) {
    for (var e in list) {
        addServerList(list[e].name, list[e].quantity, list[e].price);
    }
}


/**
 * Runs some tasks when the second AJAX request (the one we make on checkout) is successful
 *
 * @param productList
 */
function checkoutSuccess(productList) {
    var serverList = JSON.parse(productList);
    initServerProducts(serverList);
    console.log("init done");
    console.log(products);
    clientSync(cart);
    if (priceSyncStatus && quantitySyncStatus) {
        productsXhrReqCount = 0;
        confirm("Price and availability confirmed. Do you want to proceed?");
    }

}


/**
 * Shows the cart
 */
function showCart() {
    updateCartCost();
    resetTimer();
    var modalContent = '<table style="width:100%">' +
        '<tr>\n' +
        '<th>Product</th>\n' +
        '<th>Quantity</th> \n' +
        '<th>Unit Price</th>\n' +
        '<th>Amount</th>\n' +
        '</tr>';
    var cartLength = Object.keys(cart).length;

    if (cartLength > 0) {
        var totalAmount = 0;
        for (var product in cart) {
            var quantity = cart[product];
            var unitPrice = products[product].product.price;
            var amount = unitPrice * cart[product];
            totalAmount += amount;
            modalContent += '<tr> <td>' + product + '</td>' + '<td><span id =' + product + ' class="rmBtn">-</span>' + quantity + '<span id =' + product + ' class="addBtn">+</span></td>' + '<td>$' + unitPrice + '</td>' + '<td>$' + amount + '</td>' + '</tr>';
        }

        modalContent += '<br>';
        modalContent += '<tr> <td>' + '</td>' + '<td>' + '</td>' + '<td>' + '<em>Total Amount: </em></td>' + '<td>$' + totalAmount + '</td>' + '</tr>';
        modalContent += '</table> <button class="modalCheckOut">Checkout</button>';

    } else {
        modalContent = "Nothing in cart!";
    }
    var modalText = document.getElementById('modalText');
    modalText.innerHTML = modalContent;
    var modal = document.getElementById('cartModal');
    modal.style.display = "block";
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    };

    var modalCheckOut = document.getElementsByClassName('modalCheckOut')[0];
    modalCheckOut.onclick = function () {
        modal.style.display = "none";
        ajaxGet(url + '/products', checkoutSuccess, productListServerError);

    };


    //TODO: take the following two functions out of this function

    var modalAddButtons = document.getElementsByClassName("addBtn");
    console.log(modalAddButtons);
    for (var i = 0; i < modalAddButtons.length; i++) {
        modalAddButtons[i].onclick = function () {
            addToCart(this.id);
            showCart();
        };
    }


    var modalRemoveButtons = document.getElementsByClassName("rmBtn");
    console.log(modalRemoveButtons);
    for (var i = 0; i < modalRemoveButtons.length; i++) {
        modalRemoveButtons[i].onclick = function () {
            removeFromCart(this.id);
            showCart();
        };
    }


    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode === 27) {

            modal.style.display = "none";
        }
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}


/**
 * Sets the navigation menu with response from the server
 *
 * @param navMenuList
 */
function navMenuController(navMenuList) {
    setNavMenu(navMenuList);
    renderNavMenu();
}

/**
 * Sets the productlist with response from the server
 *
 * @param productList
 */
function productListController(productList) {
    productsXhrReqCount = 0;
    initializeProductList(productList);
    renderProductList();
}


/**
 * Attaches listener to add to cart button
 *
 * @param addButton
 */
function attachAddButtonListener(addButton) {
    addButton.onclick = function () {
        // TODO: move this to controller
        var productName = this.parentElement.parentElement.id;
        addToCart(productName);
    };
}


/**
 * Attaches listener to remove from cart button
 *
 * @param removeButton
 */
function attachRemoveButtonListener(removeButton) {
    removeButton.onclick = function () {
        // TODO: move this to controller
        var productName = this.parentElement.parentElement.id;
        removeFromCart(productName);
    };
}


/*
 * VIEW
 */


/**
 *
 * @param productName
 */
function hideRemoveButton(productName) {
    console.log('here');
    document.getElementById(productName + 'rBtn').style.visibility = "hidden";
}

/**
 *
 * @param productName
 */
function hideAddButton(productName) {
    console.log('reached hideAddButton');
    document.getElementById(productName + 'aBtn').style.visibility = "hidden";
}

/**
 *
 * @param productName
 */
function showAddButton(productName) {
    console.log('reached hideAddButton');
    document.getElementById(productName + 'aBtn').style.visibility = "visible";
}


/**
 *
 * @param productName
 */
function showRemoveButton(productName) {
    console.log('here');
    document.getElementById(productName + 'rBtn').style.visibility = "visible";
}


/**
 *
 * @param productName
 */
function showOutOfStockButton(productName) {
    console.log(productName + 'out of stock');
    document.getElementById(productName + 'oBtn').style.visibility = "visible";
}


/**
 *
 * @param productName
 */
function hideOutOfStockButton(productName) {
    console.log('here');
    document.getElementById(productName + 'oBtn').style.visibility = "hidden";
}

/**
 *
 */
function renderCartCost() {
    document.getElementById('showCartButton').textContent = 'Cart ($' + totalCost + ')';
}

/**
 *
 */
function renderNavMenu() {
    navMenu.forEach(function (menuItem) {
        var menu = document.getElementById('navigationMenu');
        var navButton = document.createElement('li');
        navButton.className = 'navMenuButton';
        navButton.id = menuItem;
        navButton.innerHTML = menuItem;
        menu.appendChild(navButton);
    });
}


/**
 * @param tagName
 * @param attrArray
 * @return {Element}
 */
function createNewElement(tagName, attrArray) {
    var newNode = document.createElement(tagName);
    var keys = Object.keys(attrArray);

    for (var i = 0; i < keys.length; i++) {
        switch (keys[i]) {
            case 'class':
                newNode.className = attrArray[keys[i]];
                break;
            case 'id':
                newNode.id = attrArray[keys[i]];
                break;
            case 'src':
                newNode.src = attrArray[keys[i]];
                break;
            case 'innerHTML':
                newNode.innerHTML = attrArray[keys[i]];
                break;
            default:
                console.log('weird: ' + keys[i]);
        }
    }

    return newNode;
}

/**
 * Structure for a product div:
 *
 *   product div
 *       - image
 *       - name
 *       - overlay2
 *           - cost
 *           - border shadow
 *       - overlay
 *           - cart image
 *           - add button
 *           - remove button
 */


function renderProductList() {

    for (var productName in products) {
        var product = products[productName].product;
        var pDiv = createNewElement('div', {
            'class': 'col-3 col-m-3 productDiv',
            'id': product.name
        });
        var pImage = createNewElement('img', {
            'class': 'productImg',
            'src': product.imageUrl
        });
        var pName = createNewElement('div', {
            'class': 'col-12 col-m-12 productNameDiv',
            'innerHTML': product.name
        });
        var overlayDiv2 = createNewElement('div', {
            'class': 'overlay2'
        });
        var pCost = createNewElement('div', {
            'class': 'col-12 col-m-12 productCostDiv',
            'innerHTML': '$' + product.price
        });
        var overlayDiv = createNewElement('div', {
            'class': 'overlay'
        });
        var cartImg = createNewElement('img', {
            'class': 'cartImg',
            'src': 'images/cart.png'
        });
        var addButton = createNewElement('button', {
            'class': 'col-5 col-m-5 addToCartButton',
            'innerHTML': 'Add',
            'id': product.name + 'aBtn'
        });
        var outOfStockButton = createNewElement('button', {
            'class': 'col-5 col-m-5 outOfStockButton',
            'innerHTML': 'Sorry, out of stock!',
            'id': productName + 'oBtn'
        });
        var removeButton = createNewElement('button', {
            'class': 'col-5 col-m-5 removeFromCartButton',
            'innerHTML': 'Remove',
            'id': product.name + 'rBtn'
        });

        attachAddButtonListener(addButton);
        attachRemoveButtonListener(removeButton);

        pDiv.appendChild(pImage);
        pDiv.appendChild(pName);
        overlayDiv2.appendChild(pCost);
        pDiv.appendChild(overlayDiv2);
        overlayDiv.appendChild(cartImg);
        overlayDiv.appendChild(addButton);
        overlayDiv.appendChild(removeButton);
        overlayDiv.appendChild(outOfStockButton);
        pDiv.appendChild(overlayDiv);

        var productDisplayArea = document.getElementById('productList');
        productDisplayArea.appendChild(pDiv);
    }
}