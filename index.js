var express = require('express');
var url = "mongodb://localhost:27017/db";
var assert = require('assert');
var MongoClient = require("mongodb").MongoClient;
var app = express();

//var appHost = 'https://cpen400a-bookstore.herokuapp.com/'; //hard-coded host url (should really be defined in a separate config)

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
/***** TA's random number code
 function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
 */


/* Products object removed, because we need to retrieve from MongoDB, as per Piazza post @301 and @243 */
//var products = [];

app.use(express.static(__dirname));

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
});

app.get("/navMenuList", function (request, response) {
    response.send(navMenuList);
});



app.get('/products/:productKey', function (request, response) {

    console.log('**********************************');

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (request.params.productKey in products) {
        response.json(products[request.params.productKey]);
    } else {
        response.status(404).send("Product does not exist");
    }

    /****************TA's random number code**********
     var option = getRandomInt(0, 5);

     if (option < 4) {
	  if (request.params.productKey in products){
		  response.json(products[request.params.productKey]);
	  }
	  else {
		  response.status(404).send("Product does not exist");
	  }
  } else if (option === 4) {
    response.status(500).send("An error occurred, please try again");
  }*/
});


/*
* To price-filter products send GET request with URL following the syntax below:
* '/products?minPrice=[lower-limit-number]&maxPrice=[upper-limit-number]'
*
* */

app.get('/products', function (request, response) {

    var minPrice = -1, maxPrice = Number.MAX_VALUE;
    var priceFilters = request.query;

    try {

        if (JSON.stringify(priceFilters) === '{}') {
            console.log('+ No price filters');
        } else {
            // check for invalid price filters request
            assert.notEqual(priceFilters.minPrice, undefined, 'invalidPriceFilters');
            assert.notEqual(priceFilters.maxPrice, undefined, 'invalidPriceFilters');
            minPrice = parseFloat(priceFilters.minPrice);
            maxPrice = parseFloat(priceFilters.maxPrice);
            assert.notEqual(isNaN(minPrice) || minPrice <= 0, true, 'invalidPriceFilters');
            assert.notEqual(isNaN(maxPrice) || maxPrice > Number.MAX_VALUE, true, 'invalidPriceFilters');
            assert.notEqual(minPrice > maxPrice, true, 'invalidPriceFilters');

            // received price filters are valid
            console.log('+ Valid Price Filters (min: ' + minPrice + ' max: ' + maxPrice + ')');
        }

        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        MongoClient.connect(url, function (err, db) {
            var products = [];
            assert.equal(err, null);
            var cursor = db.collection('products').find({price: {$gte: minPrice, $lte: maxPrice}});
            cursor.forEach(function (doc) {
                if (doc !== null) {
                    console.log(doc.name);
                    products.push(doc);
                }
            }, function (err) {
                if (err === null)
                    response.json(products);
            });

            db.close();
        });


    } catch (err) {
        console.error(err);
        if (err.message === 'invalidPriceFilters') {
            response.status(400);
            err.message = '- Invalid Price Filters (minPrice= ' + priceFilters.minPrice + ' maxPrice= ' + priceFilters.maxPrice + ')';
        } else {
            response.status(500);
        }
        response.send(err.message);

    }

});


// Simple nav list menu items
var navMenuList = [
    'All Items',
    'Books',
    'Clothing',
    'Tech',
    'Gifts',
    'Stationary',
    'Supplies'
];


app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'))
});