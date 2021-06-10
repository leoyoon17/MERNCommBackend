// TODO

var Product = require('../models/product');
var ProductInstance = require('../models/productInstance');

const { body, validationResult } = require('express-validator');
const async = require('async');

// Display list of all ProductInstances.
exports.productInstance_list = function(req, res) {
  ProductInstance.find({}, 'product')
    .populate('product')
    .exec(function (err, list_productInstances) {
      if (err) { return next(err); }
      // Successful, so render
      const renderObj = { 
        title: 'Product Instance List',
        productInstance_list: list_productInstances,
      };

      res.render('productInstance_list', renderObj);
    });
};

// Display detail page for a specific ProductInstance
exports.productInstance_detail = function(req, res) {
  ProductInstance.findById(req.params.id)
    .populate('product')
    .exec(function (err, productInstance) {
      if (err) { return next(err); }
      if (productInstance == null) { // No results
        var err = new Error('Product Instance not found');
        err.status = 404;
        return next(err);
      }

      // Successful, so render
      const renderObj = {
        title: productInstance.product.name,
        productInstance: productInstance,
      };
      
      res.render('productInstance_detail', renderObj);
    })
};

// Display ProductInstance Create form on GET
exports.productInstance_create_get = function(req, res) {
  Product.find({}, 'name')
    .exec(function (err, products) {
      if (err) { return next(err); }
      // Successful, So render.
      const renderObj = {
        title: 'Create Product Instance',
        product_list: products,
      };

      res.render('productInstance_form', renderObj);
    });
};

// Handle ProductInstance Create on POST
exports.productInstance_create_post = [

  // Validate and sanitize fields
  body('product', 'Product must be specified').trim().isLength({ min: 1 }).escape(),

  // Process the request after validation and sanitization.
  (req, res, next) => {
    
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a ProductInstance object with escaped and trimmed data
    var productInstance = new ProductInstance(
      {
        product: req.body.product,
      });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      Product.find({}, 'name')
        .exec(function (err, products) {
          if (err) { return next(err); }
          // Successful, so render.
          const renderObj = {
            title: 'Create Product Instance',
            product_list: products,
            selected_product: productInstance.product._id,
            errors: errors.array(),
            productInstance: productInstance,
          }
          res.render('productInstance_form', renderObj);
        });

        return;
    } else {
      // Data from form is valid.
      productInstance.save(function(err) {
        if (err) { return next(err); }
        Product.findByIdAndUpdate(productInstance.product, { status: 'Available' }, function(err, results) {

          if (err) { return next(err); }
          // Successful, redirect to Product's page          
          res.redirect(results.url);
        });
      });

      
    }

  }
];

// Display ProductInstance Delete form on GET
exports.productInstance_delete_get = function(req, res, next) {

  ProductInstance.findById(req.params.id, function (err, result) {
    if (err) { return next(err); }

    Product.findById(result.product, function (err, productResult) {
      if (err) { return next(err); }

      const renderObj = {
        title: 'Delete Product Instance',
        productInstance: result,
        product: productResult,
      };
  
      res.render('productInstance_delete', renderObj);
    });

    
  });
};

// Handle ProductInstance Delete on Post
exports.productInstance_delete_post = function(req, res) {

  ProductInstance.findByIdAndRemove(req.body.productInstanceId, function(err, result) {
    if (err) { return next(err); }

    res.redirect('/catalog/product/' + result.product);
  });
};

// Display ProductInstance Update form on GET
exports.productInstance_update_get = function(req, res) {
  res.send('NOT Implemented: ProductInstance Update GET');
};

// Handle ProductInstance Update on POST
exports.productInstance_update_post = function(req, res) {
  res.send('NOT Implemented: ProductInstance Update POST');
};

