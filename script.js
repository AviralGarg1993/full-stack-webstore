/*
 * JavaScript File for CPEN400A Assignment 2
 *
 * Author: Atif Mahmud
 *
 * DOM elements will be addded via this script in addition to adding responsiveness
 *
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




