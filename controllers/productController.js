// TODO

var Product = require('../models/product');
var Brand = require('../models/brand');
var Tag = require('../models/tag');
var ProductInstance = require('../models/productInstance');

var async = require('async');

exports.index = function(req, res) {

  async.parallel({
    product_count: function (callback) {
      Product.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
    },
    // product_instance_count: function(callback) {
    //   ProductInstance.countDocuments({}, callback);
    // },
    // product_available_count: function(callback) {
    //   Product.countDocuments({status: 'Available', callback});
    // },
    // brand_count: function(callback) {
    //   Brand.countDocuments({}, callback);
    // },
    // tag_count: function(callback) {
    //   Tag.countDocuments({}, callback);
    // }
  },
  function(err, results) {
    // After the functions above are successful, this callback function calls
    // res.render(), specifying a view (template) named 'index' and an object containing
    // the data taht is inserted into it (in this case, the count of the various models).
    console.log('done queries');
    res.render('index', { title: 'MERNCommerce', error: err, data: results});
  });
};

// Display a list of all products
exports.product_list = function(req, res) {
  Product.find({}, 'name brand')
    .populate('brand')
    .exec(function (err, list_products) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('product_list', { title: 'Product List', product_list: list_products });
    });
};

// Display detail page for a specific product
exports.product_detail = function(req, res, next) {
  
  async.parallel({
    product: function(callback) {
      Product.findById(req.params.id)
        .populate('brand')
        .populate('tag')
        exec(callback);
    },
    
    product_count: function(callback) {
      ProductInstance.countDocuments({ 'product': req.params.id}, callback)
        .exec(callback);
    },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.product==null) { // No results.
        var err = new Error('Product Not Found.');
        err.status = 404;
        return next(err);
      }

      const renderObj = {
        title: results.product.name,
        product: results.product,
        product_count: results.product_count,
      };

      // Success, so render
      res.render('product_detail', renderObj);
  });
};

// Display Product Create form on GET
exports.product_create_get = function(req, res) {
  res.send('NOT Implemented: Product Create GET');
};

// Handle Product Create on POST
exports.product_create_post = function(req, res) {
  res.send('NOT Implemented: Product Create POST');
};

// Display Product Delete form on GET
exports.product_delete_get = function(req, res) {
  res.send('NOT Implemented: Product Delete GET');
};

// Handle Product Delete on POST
exports.product_delete_post = function(req, res) {
  res.send('NOT Implemented: Product Delete POST');
};

// Display Product Update form on GET
exports.product_update_get = function(req, res) {
  res.send('NOT Implemented: Product Update GET');
};

// Handle Product Update on POST
exports.product_update_post = function(req, res) {
  res.send('NOT Implemented: Product Update POST');
};