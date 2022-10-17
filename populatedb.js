#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []



function categoryCreate(name, cb) {
  var category = new Category({ name: name });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  });
}

function itemCreate(name, description, price, numberInStock, category, cb) {
  itemdetail = {
    name: name,
    description: description,
    price: price,
    numberInStock: numberInStock
  }
  if (category != false) itemdetail.category = category

  var item = new Item(itemdetail);
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  });
}





function createCategories(cb) {
  async.series([
    function (callback) {
      categoryCreate("Toys", callback);
    },
    function (callback) {
      categoryCreate("Books", callback);
    },
    function (callback) {
      categoryCreate("Games", callback);
    }
  ],
    // optional callback
    cb);
}


function createItems(cb) {
  async.parallel([
    function (callback) {
      itemCreate('Item 1', 'Description', 9.99, 12, categories[0], callback);
    },
    function (callback) {
      itemCreate('Item 2', 'Description', 9.99, 12, categories[1], callback);
    },
    function (callback) {
      itemCreate('Item 3', 'Description', 9.99, 12, categories[2], callback);
    }
  ],
    // optional callback
    cb);
}




async.series([
  createCategories,
  createItems
],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    else {
      console.log('Items: ' + items);

    }
    // All done, disconnect from database
    mongoose.connection.close();
  });



