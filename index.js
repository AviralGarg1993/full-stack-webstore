var express = require('express');
var url = "mongodb://localhost:27017/db";
var assert = require('assert');
var MongoClient = require("mongodb").MongoClient;
var app = express();

//var appHost = 'https://cpen400a-bookstore.herokuapp.com/'; //hard-coded host url (should really be defined in a separate config)

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

/***** TA's random number code
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
 */


/* Products object removed, because we need to retrieve from MongoDB, as per Piazza post @301 and @243 */
var products = [];

/* This is what we use to get products */
app.get('/products', function (request, response) {

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    MongoClient.connect(url, function (err, db) {
        assert.equal(err, null);

        var cursor = db.collection('products').find();
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc !== null) {
                console.log(doc);
                products.push(doc);
            }
        });

        db.close();
    });

    /*************** TA's code for random number stuff************
     var option = getRandomInt(0, 5);

     if (option < 4) {

        response.json(products);

        /!********** Code to retrieve data from the MongoDB ***********!/

        MongoClient.connect(url, function (err, db) {
            assert.equal(err, null);

            var cursor = db.collection('products').find();
            cursor.each(function (err, doc) {
                assert.equal(err, null);
                if (doc !== null) {
                    console.log(doc);
                    products.push(doc);
                }
            });

            db.close();
        });

    } else if (option === 4) {
        response.status(500).send("An error occurred, please try again");
    }*/

});

app.get('/products/:productKey', function (request, response) {

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

app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'))
});