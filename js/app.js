/**
 * Created by Avi and Atif on 2017-09-13.
 */
/*
 * TODO: Questions:
 * 1. Why addEventListener doesn't work with getElementsByClassName?
 *
 * TODO list:
 * 1. injecting DOM elements with javascript
 *  */


var cart = {};
var product = {};

/* Information for all the products in the store */
var productInfo = [{"name": "Box1", "cost": "$10", "imgURI": "images/Box1_$10.png"},
    {"name": "Box2", "cost": "$5", "imgURI": "images/Box2_$5.png"}];

/* HTML injection */
var addToCartButtons = document.getElementsByClassName("addToCart");
var html = "<a> Google </a>";
document.getElementById("container").innerHTML = html;

// TODO: for (button in addToCartButtons): something like that
// TODO-continued: basically add this addEventListner for each element in the addToCartButtons array
addToCartButtons[0].addEventListener("click", function () {
    addToCart(productInfo[0].name);
});

function addToCart(productName) {
    console.log("Adding " + productName + " to cart");
}

function removeFromCart(productName) {
    console.log("addToRemoveFromCart");
}