#! /usr/bin/env node

console.log('This script populates some test products, brands and genres and productInstances to you database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async');
var Product = require('./models/product');
var Brand = require('./models/brand');
var Tag = require('./models/tag');
var ProductInstance =  require('./models/productInstance');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var brands = [];
var tags = [];
var products = [];
var productInstances = [];

// Create new Brand
function brandCreate(name, cb) {
  brandDetail = { name: name };

  var brand = new Brand(brandDetail);

  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return ;
    }

    console.log(`New Brand: ${brand}`);
    brands.push(brand);
    cb(null, brand);
  });
}

// Create new Tag
function tagCreate(name, cb) {
  tagDetail = { name: name };

  var tag = new Tag(tagDetail);

  tag.save(function (err) {
    if (err) {
      cb(err, null);
      return ;
    }

    console.log(`New Tag: ${tag}`);
    tags.push(tag);
    cb(null, tag);
  });
}

// Create new Product
function productCreate(name, brand, price, description, tag, status, cb) {
  productDetail = {
    name: name,
    brand: brand,
    price: price,
    description: description,
  }

  if (tag != false) { productDetail.tag = tag; }
  if (status != false) { productDetail.status = status; }

  var product = new Product(productDetail);
  product.save(function (err) {
    if (err) {
      cb(err, null);
      return ;
    }

    console.log(`New Product: ${product}`);
    products.push(product);
    cb(null, book);
  });
}

// Create new ProductInstance
function productInstanceCreate(product, cb) {
  productInstanceDetail = {
    book: book,
  };

  var productInstance = new ProductInstance(productInstanceDetail);
  productInstance.save(function (err) {
    if (err) {
      console.log(`Error Creating ProductInstance: ${productInstance}`);
      cb(err, null);
      return ;
    }

    console.log(`New ProductInstance: ${productInstance}`);
    productInstances.push(productInstance);
    cb(null, product);
  });
}

// Generate some new Brands and tags
function generateBrandsAndTags(cb) {
  async.series([
    function(callback) {
      brandCreate('Staedtler', callback);
    },
    function(callback) {
      brandCreate('Muji', callback);
    },
    function(callback) {
      brandCreate('Sakura Color Products Corporation', callback);
    },
    function(callback) {
      brandCreate('Parker', callback);
    },
    function(callback) {
      brandCreate('Montblanc', callback);
    },
    function(callback) {
      tagCreate("Mechanical Pencil", callback);
    },
    function(callback) {
      tagCreate("Eraser", callback);
    },
    function(callback) {
      tagCreate("Notebook", callback);
    },
    function(callback) {
      tagCreate("Pen", callback);
    },
    function(callback) {
      tagCreate("Fountain Pen", callback);
    },
  ]);
}

// Generates some new Products
function generateProducts(cb) {
  async.parallel([
    function(callback) {
      const desc = "Mechanical pencil for writing and drawing";
      productCreate('Mars micro 775', brands[0], 8.99, desc, tags[0], 'Available', callback);
    },
    function(callback) {
      const desc = "Gel-ink ballpoint pen with a frosted body for writing or drawing. The tip of the pen uses a mechanism to keep the ink from flowing in the reverse direction and drying out. The water-based ink allows for smooth writing and no bleeding through papers. It also produces bright colors.";
      productCreate('Gel Ink Ballpoint Pen Cap Type 0.5mm Black', brands[1], 1.50, desc, tags[2], 'Available', callback);
    },
    function(callback) {
      const desc = "Premium quality, Hybrid PVC foam eraser.";
      productCreate('SumoGrip Eraser', brand[2], 10.23, desc, tags[1], 'Available', callback);
    },
    function(callback) {
      const desc = "The Meisterstück 149 - a design that writes history. Deep black precious resin with gold-coated details, surmounted by the white star emblem and finished with a handcrafted Au 750 gold nib, evolves into Montblanc’s design icon.";
      productCreate('Meisterstück Gold-coated 149 Fountain Pen', brand[4], 1155, desc, tags[4], 'Available', callback);
    }, 
  ],
  // optional callback
  cb
  );
}

// Generate some new Product Instances
function generateProductInstances(cb) {
  async.parallel([
    function(callback) {
      productInstanceCreate(products[0], callback);
    },
    function(callback) {
      productInstanceCreate(products[0], callback);
    },
    function(callback) {
      productInstanceCreate(products[0], callback);
    },
    function(callback) {
      productInstanceCreate(products[0], callback);
    },
    function(callback) {
      productInstanceCreate(products[0], callback);
    },
    function(callback) {
      productInstanceCreate(products[1], callback);
    },
    function(callback) {
      productInstanceCreate(products[1], callback);
    },
    function(callback) {
      productInstanceCreate(products[1], callback);
    },
    function(callback) {
      productInstanceCreate(products[1], callback);
    },
    function(callback) {
      productInstanceCreate(products[2], callback);
    },
    function(callback) {
      productInstanceCreate(products[2], callback);
    },
    function(callback) {
      productInstanceCreate(products[2], callback);
    },
    function(callback) {
      productInstanceCreate(products[2], callback);
    },
    function(callback) {
      productInstanceCreate(products[3], callback);
    },
    function(callback) {
      productInstanceCreate(products[3], callback);
    },
    function(callback) {
      productInstanceCreate(products[3], callback);
    },
  ],
  cb);
}

async.series([
  generateBrandsAndTags,
  generateProducts,
  generateProductInstances
],
// Optional callback
function(err, results) {
  if (err) {
    console.log(`FINAL ERR: ${err}`);
  }

  else {
    console.log(`PRODUCTInstances: ${productInstances}`);
  }

  // All done, disconnect from database
  mongoose.connection.close();
  console.log('exiting...');
  exit();
});