var express = require('express');
var url = "mongodb://localhost:27017/db";
var assert = require('assert');
var MongoClient = require("mongodb").MongoClient;
var app = express();
app.use(express.json());	// <- alias to bodyParser.json
app.use(express.urlencoded());	// <- alias to bodyParser.urlencoded
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
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


/**
 ************************************************************************************************************************************************
 * TASK 4:
 *         +1: Handler for POST /checkout endpoint
 *         +1: When POST /checkout is made, insert order into db
 *         +1: Clicking Checkout makes the POST request
 ************************************************************************************************************************************************
 */


/* Handler for POST /checkout endpoint, accepts a JSON formatted object */
app.post('/checkout', function (request, response) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        var token = request.get("token");
        // insert cart and total into orders collection
        db.collection('orders').insertOne({cart: request.body.cart, total: parseFloat(request.body.total)});
        for (var pName in request.body.cart) {
            // update the quantities of the products added to the orders
            db.collection('products').updateOne({"name": pName}, {$inc: {"quantity": -request.body.cart[pName]}});	
        }
        response.send("Done"); /* Send response, else request keeps being resent */
    });
});
