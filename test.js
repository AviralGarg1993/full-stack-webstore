var assert = require('assert');
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/db";

MongoClient.connect(url, function(err, db) {
    assert.equal(err, null);
    
    var cursor = db.collection('products').find( );
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
           console.log(doc);
        } 
     });
  
    db.close();
  });
  