/**
 * File: initdb.js
 * 
 * Initialises the mongoDB collections
 *
 */


/**
 * TO USE THIS TO CREATE A DATABASE:
 *  
 * 1) Get mongod and mongo up and running  
 * 2) Enter 'use db' command in mongo
 * 3) Enter 'load("initdb.js"); in mongo' 
 *
 */ 


/* Load the products to the database */

db.products.insertMany([
		{"name":"KeyboardCombo","price":33,"quantity":9,"imageUrl":"https://cpen400a-bookstore.herokuapp.com/images/KeyboardCombo.png"},
		{"name":"Mice","price":7,"quantity":0,"imageUrl":"https://cpen400a-bookstore.herokuapp.com/images/Mice.png"},
	    {"name":"PC1","price":336,"quantity":7,"imageUrl":"https://cpen400a-bookstore.herokuapp.com/images/PC1.png"},
	    {"name":"PC2","price":373,"quantity":5,"imageUrl":"https://cpen400a-bookstore.herokuapp.com/images/PC2.png"},
	    {"name":"PC3","price":373,"quantity":9,"imageUrl":"https://cpen400a-bookstore.herokuapp.com/images/PC3.png"},
	    {"name":"Tent","price":30,"quantity":5,"imageUrl":"https://cpen400a-bookstore.herokuapp.com/images/Tent.png"},
	    {"name":"Box1","price":7,"quantity":9,"imageUrl":"https://cpen400a-bookstore.herokuapp.com/images/Box1.png"},
	    {"name":"Box2","price":7,"quantity":6,"imageUrl":"https://cpen400a-bookstore.herokuapp.com/images/Box2.png"},
	    {"name":"Clothes1","price":30,"quantity":2,"imageUrl":"https://cpen400a-bookstore.herokuapp.com/images/Clothes1.png"},
	    {"name":"Clothes2","price":23,"quantity":4,"imageUrl":"https://cpen400a-bookstore.herokuapp.com/images/Clothes2.png"},
	    {"name":"Jeans","price":37,"quantity":4,"imageUrl":"https://cpen400a-bookstore.herokuapp.com/images/Jeans.png"},
	    {"name":"Keyboard","price":23,"quantity":9,"imageUrl":"https://cpen400a-bookstore.herokuapp.com/images/Keyboard.png"}
	]);


/* Load the users */




/* Load the orders */