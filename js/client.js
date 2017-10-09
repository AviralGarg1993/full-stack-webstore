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
var productInfo = [];
var cart = [];
var inactiveTime = 0;
const imgDIR = '/images/products/';
const INITIAL_QUANTITY = 5;


function resetTimer() {
    inactiveTime = 0;
}

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


function addProductInfo(name, quantity, cost) {
    productInfo[name] = {
        quantity: quantity,
        cost: cost
    };
}

function addProduct(name, quantity) {
    products[name] = quantity;
}

function stringToArray(str) {
    return JSON.parse("[" + str + "]");
}

function setNavMenu(navMenuList) {
    navMenu = stringToArray(navMenuList);
    return navMenu;
}

// this initializes cart as well
function initializeProductList(productList) {
    var temp = stringToArray(productList);
    temp[0].forEach(function (product) {
        var pName = product.split('_')[0];
        var pQuantity = INITIAL_QUANTITY;
        var pCost = product.split('_')[1];
        addProductInfo(pName, pQuantity, pCost);

        // only for assignment-2
        addProduct(pName, pQuantity);
    });

    return products;
}

function getProdCost(product) {
    return productInfo[product]['cost'];
}

function productInCart(pName) {
    return !(cart[pName] === undefined);
}

/*
 * CONTROLLER
 */
function addToCart(productName) {
    resetTimer();
    if (productInfo[productName]['quantity'] <= 0) {
        // out of stock
    } else {
        if (!productInCart(productName)) {
            //TODO: move this to model
            cart[productName] = 0;
        }
        --productInfo[productName]['quantity'];
        --products[productName];
        ++cart[productName];
    }
}

function removeFromCart(productName) {
    resetTimer();
    if (!productInCart(productName)) {
        // already 0!
        alert(productName + ' does not exist in the cart!');
    } else {
        ++productInfo[productName]['quantity'];
        ++products[productName];
        if (--cart[productName] === 0) {
            //TODO: move this to model
            delete cart[productName];
        }
    }
}

function showCart() {
    var alertMsg = '';
    var cartLength = Object.keys(cart).length;
    if (cartLength > 0) {
        for (var product in cart) {
            alertMsg += product + ' : ' + cart[product] + '\n';
        }
    } else {
        alertMsg = "Nothing in cart!";
    }
    alert(alertMsg);
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.response);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function navMenuController(navMenuList) {
    setNavMenu(navMenuList);
    renderNavMenu();
}

function productListController(productList) {
    initializeProductList(productList);
    renderProductList();
}

/*
 * VIEW
 */
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


function createNewNode(tagName, attrArray) {
    var newNode = document.createElement(tagName);
    var keys = Object.keys(attrArray);

    for (var i = 0; i < keys.length; i++) {
        switch (keys[i]) {
            case 'class':newNode.className = attrArray[keys[i]];break;
            case 'id':newNode.id = attrArray[keys[i]];break;
            case 'src':newNode.src = attrArray[keys[i]];break;
            case 'innerHTML':newNode.innerHTML = attrArray[keys[i]];break;
            default:console.log('weird: ' + keys[i]);
        }
    }

    return newNode;
}

/*
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

    for (var product in products) {
        var pDiv        = createNewNode('div',{'class':'col-3 col-m-3 productDiv', 'id':product});
        var pImage      = createNewNode('img',{'class':'productImg','src':imgDIR+product+'_' + productInfo[product]['cost']+'.png'});
        var pName       = createNewNode('div',{'class':'col-12 col-m-12 productNameDiv','innerHTML':product});
        var overlayDiv2 = createNewNode('div',{'class':'overlay2'});
        var pCost       = createNewNode('div',{'class':'col-12 col-m-12 productCostDiv','innerHTML': productInfo[product]['cost']});
        var overlayDiv  = createNewNode('div',{'class':'overlay'});
        var cartImg     = createNewNode('img',{'class':'cartImg','src':'images/cart.png'});
        var addButton   = createNewNode('button',{'class':'col-5 col-m-5 addToCartButton','innerHTML':'Add'});

        addButton.onclick = function () {
            // TODO: move this to controller
            var productName = this.parentElement.parentElement.id;
            addToCart(productName);
        };

        var removeButton = createNewNode('button',{'class': 'col-5 col-m-5 removeFromCartButton','innerHTML': 'Remove'});
        removeButton.onclick = function () {
            // TODO: move this to controller
            var productName = this.parentElement.parentElement.id;
            removeFromCart(productName);
        };

        pDiv.appendChild(pImage);
        pDiv.appendChild(pName);
        overlayDiv2.appendChild(pCost);
        pDiv.appendChild(overlayDiv2);
        overlayDiv.appendChild(cartImg);
        overlayDiv.appendChild(addButton);
        overlayDiv.appendChild(removeButton);
        pDiv.appendChild(overlayDiv);

        var productDisplayArea = document.getElementById('productList');
        productDisplayArea.appendChild(pDiv);
    }
}
