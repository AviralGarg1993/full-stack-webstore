/*
 * JavaScript File for CPEN400A Assignment 2
 *
 * Author: Atif Mahmud
 *
 * DOM elements will be addded via this script in addition to adding responsiveness
 *
 */

 // Array holding the menu items 
 var navArray = ["All Items", "Books", "Clothing", "Tech", "Gifts", "Stationary", "Supplies"];


 // Function to create the list from the array
 function makeUL(array){

 	var list = document.createElement('ul');

 	for(var i =0; i < array.length(); i++){

 		// This creates the item
 		var item = document.createElement('li');
 		
    	// This sets the contents
 		item.innerHTML(array[i]);
 		
 		// This adds it to the list
 		list.appendChild(item);

 		return list;

 	}

 	document.getElementById('navigationMenu').appendChild(makeUL(navArray));
 }
