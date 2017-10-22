/*
 * JavaScript File for CPEN400A Assignment 2 (starting off with JS DOM Manipulation for Assignment - 1)
 *
 * Author: Atif Mahmud
 *
 * DOM elements will be addded via this script in addition to adding responsiveness
 *
 */


// Global variable products, as defined in 2B
var products = {"Box1" : 2, "Box2": 1, "Clothes1": 44, "Clothes2": 55555, "Jeans": 5, "KeyboardCombo": 5, "Mouse": 5, "PC1": 5, "PC2": 5, "PC3": 5, "Tent": 5};
initializeProducts(products);

// Function to initialize the products
function initializeProducts(params){
	for (var e in params){
		console.log("Before  " + e + "  = " + products[e]);  // to check 
		products[e] = 5;
		console.log("After " + e + "  = " + products[e]);	// to check
	}
}

// Make sure it runs everytime window loads
window.onload = initializeProducts;  	



/**
 * Assignment 1 stuff. Using JS for DOM Manipulation
 * ===============================================================================================================================================
 */
  

 // Array holding the menu items 
 var navArray = ["All Items", "Books", "Clothing", "Tech", "Gifts", "Stationary", "Supplies", "Foobar"];

 // Function to create the list from the array
 function makeUL(){

 	// Create a ul
 	var list = document.createElement('ul');

 	for(var i =0; i < navArray.length; i++){
 		
 		// This creates the item, and we create it as abutton
 		var item = document.createElement('button');
    	
    	// This sets the contents of the button
 		item.innerHTML += navArray[i];
 		
 		// This adds it to the list
 		list.appendChild(item);
 	}

 	// Add the completed list to the div
 	document.getElementById("navigationMenu").appendChild(list);
 }



