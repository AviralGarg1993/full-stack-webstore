console.log('IMPORTANT: Please run the command "npm install" and ' +
'then "heroku local web" in the source directory');
httpGetAsync('/navMenuList', navMenuController);
httpGetAsync('/productList', productListController);
document.getElementById('showCartButton').onclick = showCart;

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

const INITIAL_QUANTITY = 5;

function addProductInfo(name, quantity, cost){
	productInfo[name] = {
		quantity: quantity,
		cost: cost
	};
}

// only for assignment-2
function addProduct(name, quantity){
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
function initializeProductList(productList){
	var temp = stringToArray(productList);
	temp[0].forEach(function(product){
		var pName = product.split('_')[0];
		var pQuantity = INITIAL_QUANTITY;
		var pCost = product.split('_')[1];
		addProductInfo(pName, pQuantity, pCost);

		// only for assignment-2
		addProduct(pName, pQuantity);
	});

	return products;
}

function getProdCost(product){
	return productInfo[product]['cost'];
}

function productInCart(pName){
	return !(cart[pName] === undefined);
}

/*
 * CONTROLLER
 */
function addToCart(productName){
	if(productInfo[productName]['quantity'] <= 0 ) {
		// out of stock
	} else {
		if(!productInCart(productName)){
			//TODO: move this to model
			cart[productName] = 0;
		}
		--productInfo[productName]['quantity'];
		--products[productName];
		++cart[productName];
	}
}

function removeFromCart(productName){
	if (!productInCart(productName)) {
		// already 0!
		alert(productName + ' does not exist in the cart!');
	} else {
		++productInfo[productName]['quantity'];
		++products[productName];
		if(--cart[productName] === 0){
			//TODO: move this to model
			delete cart[productName];
		}
	}
}

function showCart(){
	var alertMsg = '';
	var cartLength = Object.keys(cart).length;
	if(cartLength > 0){
		for(var product in cart){
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

function getProductCost(product) {
	return getProdCost(product);
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

function renderProductList() {
	for(var product in products) {
		var productDiv = document.createElement('div');
		productDiv.className = ' col-3 col-m-3 productDiv';
		productDiv.id = product;

		var img = document.createElement('img');
		img.className = 'productImg';
		img.src = '/images/products/' + product + '_' +
			productInfo[product]['cost'] + '.png';
		img.innerHTML = 'abc'
		productDiv.appendChild(img);

		var productNameDiv = document.createElement('div');
		productNameDiv.className = 'col-12 col-m-12 productNameDiv';
		productNameDiv.innerHTML = product;
		productDiv.appendChild(productNameDiv);


		var overlayDiv2 = document.createElement('div');
		overlayDiv2.className = 'overlay2';

		var productCostDiv = document.createElement('div');
		productCostDiv.className = 'col-12 col-m-12 productCostDiv';
		productCostDiv.innerHTML = getProductCost(product);
		overlayDiv2.appendChild(productCostDiv);
		productDiv.appendChild(overlayDiv2);

		var overlayDiv = document.createElement('div');
		overlayDiv.className = 'overlay';

		var cartImg = document.createElement('img');
		cartImg.className = 'cartImg';
		cartImg.src='images/cart.png';
		overlayDiv.appendChild(cartImg);

		var addButton = document.createElement('button');
		addButton.className = 'col-5 col-m-5 addToCartButton';
		addButton.innerHTML = 'Add';
		addButton.onclick = function () {
			// TODO: move this to controller
			var productName = this.parentElement.parentElement.id;
			addToCart(productName);
		}
		overlayDiv.appendChild(addButton);

		var removeButton = document.createElement('button');
		removeButton.className = 'col-5 col-m-5 removeFromCartButton';
		removeButton.innerHTML = 'Remove';
		removeButton.onclick = function () {
			// TODO: move this to controller
			var productName = this.parentElement.parentElement.id;
			removeFromCart(productName);
		}
		overlayDiv.appendChild(removeButton);
		productDiv.appendChild(overlayDiv);


		var productDisplayArea = document.getElementById('productList');

		productDisplayArea.appendChild(productDiv);
	};
}
