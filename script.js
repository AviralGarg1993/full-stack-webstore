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
 function makeUL(){
 	console.log("a");

 	var list = document.createElement('ul');

 	for(var i =0; i < navArray.length; i++){

 		// This creates the item
 		var item = document.createElement('button');
 		
    	// This sets the contents
 		item.innerHTML += navArray[i];
 		
 		// This adds it to the list
 		list.appendChild(item);

 		console.log(list);

 	}

 	document.getElementById("navigationMenu").appendChild(list);
 }
