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

var element = document.getElementsByClassName("addToCart");

element[0].addEventListener("click", function () {
    var selectedProduct = "bow1";
    // find the name of the selected product
    console.log(element.parentElement.nodeName);
    addToCart(selectedProduct);
});

function addToCart(productName) {
    console.log("addToCart " + productName);
}

function removeFromCart(productName) {
    console.log("addToRemoveFromCart");
}