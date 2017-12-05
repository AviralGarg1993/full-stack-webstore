// server.js

// init project
var express = require('express');
var app = express();
const fs = require('fs');
var mongodb = require('mongodb'); /* <Added for Assignment 5> */

var productArray = [];

// set port
// env stands for environment
// heroku sets the port or port would be 8080
var port = process.env.PORT || 8080;
const productImageFolder = __dirname + '/images/products/';

// static files
app.use(express.static(__dirname));

// routes
app.get("/", function (request, response) {
    response.sendFile(__dirname + '/index.html');
});

app.get("/navMenuList", function (request, response) {
    response.send(navMenuList);
});

fs.readdir(productImageFolder, function (err, files) {
    files.forEach(function (product) {
        console.log(product);
		if (product.substr(-4) === '.png') {
            console.log(product.slice(0,-4));
            productArray.push(product.slice(0,-4));
        }

        //console.log(arr);
    });
});
/*
app.get("/products", function (request, response) {
    console.log(productArray);
	response.send(productArray);
});
*/
app.get("/dreams/:tag", function (request, response) {
    console.log("hello" + request.params.tag);
    response.send(dreams);
});

app.get("/javaFile/:tag", function (request, response) {
    response.sendFile(__dirname + '/src/' + request.params.tag)
});


// Simple in-memory store for now
var navMenuList = [
    'All Items',
    'Books',
    'Clothing',
    'Tech',
    'Gifts',
    'Stationary',
    'Supplies'
];

// Server must listen for requests and send response to each request
app.listen(port, function () {
    console.log("app listening on port: " + port);
});



