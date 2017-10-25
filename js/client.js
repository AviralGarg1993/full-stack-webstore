/**
 *
 * @param name
 * @param price
 * @param imageUrl
 * @constructor
 */
var Product = function (name, price, imageUrl){
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;
};

/**
 *
 * @param quantity
 * @returns {number}
 */
Product.prototype.computeNetPrice = function(quantity) {
    return this.price*quantity;
};

console.log('IMPORTANT: Please run the command "npm install" and ' +
    'then "heroku local web" in the source directory');
httpGetAsync('/navMenuList', navMenuController);
httpGetAsync('/productList', productListController);

//TODO: move to controller
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
var navMenu;
var products = [];
var cart = [];
var inactiveTime = 0;
const imgDIR = '/images/products/';
const INITIAL_QUANTITY = 5;
const INACTIVE_TIME_LIMIT = 300;
var totalCost = 0;

function resetTimer() {
    inactiveTime = 0;
}

function startTimer() {
    if (inactiveTime >= INACTIVE_TIME_LIMIT) {
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
 * @param name
 * @param quantity
 * @param cost
 */
function addProduct(name, quantity, cost) {
    var imgURI = imgDIR + name + '_' + cost + '.png';
    products[name] = {
        product: new Product(name, cost, imgURI),
        quantity: quantity
    }
}

/**
 *
 * @param str
 */
function stringToArray(str) {
    return JSON.parse("[" + str + "]");
}

/**
 *
 * @param navMenuList
 * @returns {*}
 */
function setNavMenu(navMenuList) {
    navMenu = stringToArray(navMenuList);
    return navMenu;
}

/**
 * @param productList
 * @return {Array}
 */
function initializeProductList(productList) {
    var temp = stringToArray(productList);
    temp[0].forEach(function (product) {
        var pName = product.split('_')[0];
        var pQuantity = INITIAL_QUANTITY;
        var pCost = product.split('_')[1];
        addProduct(pName, pQuantity, pCost);
    });

    return products;
}

/**
 * @param pName
 * @return {boolean}
 */
function productInCart(pName) {
    return !(cart[pName] === undefined);
}


function updateCartCost() {
    var keys = Object.keys(cart);
    totalCost=0;
    for (var i = 0; i < keys.length; i++) {
        var pName = keys[i];
        var pQuantity = cart[pName];
        var pPrice = products[pName].product.price.substr(1);

        console.log('name: ' + pName + 'pQuant: ' + pQuantity + 'pPrice: ' + pPrice);
        totalCost += pPrice*pQuantity;
    }

    renderCartCost();
}
















/*
 * CONTROLLER
 */


/**
 * @param productName
 */
function addToCart(productName) {
    resetTimer();
    showRemoveButton(productName);
    if (products[productName]['quantity'] <= 0) {
        // out of stock
        alert( productName + ' Out of Stock!');
    	hideAddButton(productName);
    	showOutOfStockButton(productName);

    } else {
        if (!productInCart(productName)) {
            //TODO: move this to model
            cart[productName] = 0;
        }
        --products[productName]['quantity'];
        ++cart[productName];
    }
    updateCartCost();

 
}

/**
 * @param productName
 */
function removeFromCart(productName) {
    resetTimer();
    showAddButton(productName);
    hideOutOfStockButton(productName);
    if (!productInCart(productName)) {
        // already 0!
        alert(productName + ' does not exist in the cart!');
    } else {
        ++products[productName]['quantity'];
        if (--cart[productName] === 0) {
            hideRemoveButton(productName);
            //TODO: move this to model
            delete cart[productName];
        }
    }
    
    updateCartCost(pr);
}

function showCart() {
    updateCartCost();
    resetTimer();
    var modalContent = '<table style="width:100%">'+
    '<tr>\n' +
        '<th>Product</th>\n' +
        '<th>Quantity</th> \n' +
        '<th>Unit Price</th>\n' +
        '<th>Amount</th>\n' +
    '</tr>';
    var cartLength = Object.keys(cart).length;

    if (cartLength > 0) {
        var totalAmount=0;
        for (var product in cart) {
            var quantity = cart[product];
            var unitPrice = products[product].product.price.substr(1);
            var amount = unitPrice*cart[product];
            totalAmount +=amount;
            modalContent += '<tr> <td>' +product + '</td>' + '<td><span id =' + product + ' class="rmBtn">-</span>' + quantity + '<span id =' + product + ' class="addBtn">+</span></td>' + '<td>$' + unitPrice + '</td>' +'<td>$' + amount + '</td>' + '</tr>';
        }

        modalContent += '<br>';
        modalContent += '<tr> <td>' +'</td>' + '<td>' + '</td>' + '<td>' + '<em>Total Amount: </em></td>' +'<td>$' + totalAmount + '</td>' + '</tr>';
        modalContent += '</table> <button class="modalCheckOut">Checkout</button>';

    } else {
        modalContent = "Nothing in cart!";
    }
    var modalText = document.getElementById('modalText');
    modalText.innerHTML =modalContent;
    var modal = document.getElementById('cartModal');
    modal.style.display = "block";
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    };

    var modalCheckOut = document.getElementsByClassName('modalCheckOut')[0];
    modalCheckOut.onclick = function() {
        modal.style.display = "none";
    };



    //TODO: take the following two functions out of this function

    var modalAddButtons = document.getElementsByClassName("addBtn");
    console.log(modalAddButtons);
    for(var i=0; i<modalAddButtons.length;i++) {
        modalAddButtons[i].onclick = function () {
            addToCart(this.id);
            showCart();
        };
    }

    var modalRemoveButtons = document.getElementsByClassName("rmBtn");
    console.log(modalRemoveButtons);
    for(var i=0; i<modalRemoveButtons.length;i++) {
        modalRemoveButtons[i].onclick = function () {
            removeFromCart(this.id);
            showCart();
        };
    }

    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {

            modal.style.display = "none";
        }
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}

/**
 * @param theUrl
 * @param callback
 */
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.response);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

/**
 * @param navMenuList
 */
function navMenuController(navMenuList) {
    setNavMenu(navMenuList);
    renderNavMenu();
}

/**
 * @param productList
 */
function productListController(productList) {
    initializeProductList(productList);
    renderProductList();
}



/**
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


function hideRemoveButton(productName) {
    console.log('here');
    document.getElementById(productName+'rBtn').style.visibility = "hidden";
}

function hideAddButton(productName) {
    console.log('reached hideAddButton');
    document.getElementById(productName+'aBtn').style.visibility = "hidden";
}

function showAddButton(productName) {
    console.log('reached hideAddButton');
    document.getElementById(productName+'aBtn').style.visibility = "visible";
}



function showRemoveButton(productName) {
    console.log('here');
    document.getElementById(productName+'rBtn').style.visibility = "visible";
}


function showOutOfStockButton(productName) {
    console.log(productName + 'out of stock');
    document.getElementById(productName+'oBtn').style.visibility = "visible";
}


function hideOutOfStockButton(productName) {
    console.log('here');
    document.getElementById(productName+'oBtn').style.visibility = "hidden";
}

function renderCartCost() {
    document.getElementById('showCartButton').textContent = 'Cart ($' + totalCost + ')';
}

function renderNavMenu() {
    navMenu[0].forEach(function (menuItem) {
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
            case 'class':newNode.className = attrArray[keys[i]];break;
            case 'id':newNode.id = attrArray[   keys[i]];break;
            case 'src':newNode.src = attrArray[keys[i]];break;
            case 'innerHTML':newNode.innerHTML = attrArray[keys[i]];break;
            default:console.log('weird: ' + keys[i]);
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
        console.log(product);
        var pDiv             = createNewElement('div', {'class': 'col-3 col-m-3 productDiv', 'id': product.name});
        var pImage           = createNewElement('img', {'class': 'productImg','src': product.imageUrl});
        var pName            = createNewElement('div', {'class': 'col-12 col-m-12 productNameDiv', 'innerHTML': product.name});
        var overlayDiv2      = createNewElement('div', {'class': 'overlay2'});
        var pCost       	 = createNewElement('div', {'class': 'col-12 col-m-12 productCostDiv','innerHTML': product.price});
        var overlayDiv       = createNewElement('div', {'class': 'overlay'});
        var cartImg          = createNewElement('img', {'class': 'cartImg', 'src': 'images/cart.png'});
        var addButton        = createNewElement('button', {'class': 'col-5 col-m-5 addToCartButton', 'innerHTML': 'Add', 'id': product.name+'aBtn'});
        var outOfStockButton = createNewElement('button', {'class': 'col-5 col-m-5 outOfStockButton', 'innerHTML': 'Sorry, out of stock!', 'id': productName+'oBtn'});
        var removeButton     = createNewElement('button', {'class': 'col-5 col-m-5 removeFromCartButton','innerHTML': 'Remove', 'id':product.name+'rBtn'});

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
