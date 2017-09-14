/*
 * Created by Aviral and Atif on 2017-09-13.
 */


/*
 * Questions:
 * 1. Why addEventListener doesn't work with getElementsByClassName?
 *          Answer:  because class one returns an array
 *
 * TODO (overall):
 * # remove console.log()s
 * # injecting DOM elements with javascript
 * # Google/Piazza things like:
 *      - Test Driven Development
 *      - javascript doc comments (possible: http://usejsdoc.org/about-getting-started.html)
 *      - variable declaration
 *      - naming conventions
 *      - global variables
 *      - tabs/spaces
 *      - format files that automatically changes the code style
 *      - mutable variable is accessible from closure
 *      - overflow when changing the width of screen
 *
 * TODO (IMPORTANT):
 * 1. look for changes in assignment by professor (code so far is based on Dr. Karthik's assignment)
 *
 * Assumptions:
 * - Add and remove buttons' parent will contain id-attribute storing their respective product names
 * - Each product has an Add and Remove button
 */


/* Global Variables */
var cart = [];                  // < product name, # of that product ordered >
var products = [];               // < product name, # of that product remaining in the store >
var inactiveTime = 0;


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

window.onload = startTimer;


initializeVariables();
initializeEventListeners();

/* initialize initial variables */
function initializeVariables() {

    /* TODO: HTML injection */
    var htmlCode = "<a href='http://www.google.com'> testing </a>";
    document.getElementById("container").innerHTML = htmlCode;

    /* Information for all the products in the store */
    var productInfo = [
        {"name": "Box1", "cost": "$10", "imgURI": "images/Box1_$10.png"},
        {"name": "Box2", "cost": "$5", "imgURI": "images/Box2_$5.png"},
        {"name": "Clothes1", "cost": "$20", "imgURI": "images/Clothes1_$20.png"},
        {"name": "Clothes2", "cost": "$30", "imgURI": "images/Clothes2_$30.png"},
        {"name": "Jeans", "cost": "$50", "imgURI": "images/Jeans_$50.png"},
        {"name": "Keyboard", "cost": "$20", "imgURI": "images/Keyboard_$20.png"},
        {"name": "KeyboardCombo", "cost": "$40", "imgURI": "images/KeyboardCombo_$40.png"},
        {"name": "Mice", "cost": "$20", "imgURI": "images/Mice_$20.png"},
        {"name": "PC1", "cost": "$350", "imgURI": "images/PC1_$350.png"},
        {"name": "PC2", "cost": "$400", "imgURI": "images/PC2_$400.png"},
        {"name": "PC3", "cost": "$300", "imgURI": "images/PC3_$300.png"},
        {"name": "Tent", "cost": "$100", "imgURI": "_$100imagesTentBox2_$5.png"}
    ];

    productInfo.forEach(function (item) {
        cart[item.name] = 0;
        products[item.name] = 5;
    });
}

function initializeEventListeners() {

    /*
     * Event Listeners:
     * - Add button
     * - Remove button
     */

    var addToCartButtons = document.getElementsByClassName("addToCart");
    var removeFromCartButtons = document.getElementsByClassName("removeFromCart");

    // TODO: change if we are allowed to use ES6
    // TODO-continued: do something like https://stackoverflow.com/questions/22754315/for-loop-for-htmlcollection-elements
    // TODO: Q: Should they not be combined in one loop
    for (var i = 0; i < addToCartButtons.length; i++) {
        // TODO: why this closure problem got fixed???
        (function () {
            var addButton = addToCartButtons[i];
            addButton.addEventListener("click", function () {
                addButton.parentNode.childNodes[3].style.display = 'inline-block';
                // add-button's parent must have an id with the name of the product
                var itemName = addButton.parentNode.id;
                addToCart(itemName);
            });
        })();

    }

    for (i = 0; i < addToCartButtons.length; i++) {
        (function () {
            var removeButton = removeFromCartButtons[i];
            removeButton.addEventListener("click", function () {
                // remove-button's parent must have an id with the name of the product
                var itemName = removeButton.parentNode.id;
                removeFromCart(itemName);
            });
        })();

    }
}

function addToCart(productName) {
    resetTimer();
    if (cart[productName] < 5) {
        console.log("Adding 1 " + productName);
        cart[productName]++;
        products[productName]--;
    } else {
        // TODO: create a modal instead
        alert("No more " + productName + " left!");
    }
    console.log("Number of " + productName + "(s) in cart: " + cart[productName]);
    console.log("Number of " + productName + "(s) left in store: " + products[productName]);
}

function removeFromCart(productName) {
    resetTimer();
    if (cart[productName] > 0) {
        console.log("Removing 1 " + productName);
        cart[productName]--;
        products[productName]++;
        if (cart[productName] == 0) {
            // no more product left; hide remove button
            document.getElementById(productName).childNodes[3].style.display = 'none';
        }
    } else {
        // TODO: create a modal instead
        alert("No more " + productName + " in the cart");
    }
    console.log("Number of " + productName + "(s) in cart: " + cart[productName]);
    console.log("Number of " + productName + "(s) left in store: " + products[productName]);
}