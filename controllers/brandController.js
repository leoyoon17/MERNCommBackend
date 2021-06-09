// TODO

var Brand = require('../models/brand');
var Product = require('../models/product');

const async = require('async');
const { body, validationResult } = require("express-validator");

// Display list of all brands
exports.brand_list = function(req, res) {
  Brand.find({}, 'name')
    .sort([['name', 'ascending']])
    .exec(function (err, list_brands) {
      if (err) { return next(err); }
      // Success, so render
      const renderObj = {
        title: 'Brand List',
        brand_list: list_brands
      };
      res.render('brand_list', renderObj);
    });
};

// Display detail page for a specific brand
exports.brand_detail = function(req, res) {
  
  async.parallel({
    brand: function(callback) {
      Brand.findById(req.params.id)
        .exec(callback);
    },

    brand_products: function(callback) {
      Product.find({ 'brand': req.params.id})
        .exec(callback);
    },

  }, function(err, results) {
    if (err) { return next(err); }
    if (results.brand==null) { // No results.
      var err = new Error('Brand not found');
      err.status = 404;
      return next(err);
    }

    // Successful, so render
    const renderObj = {
      title: results.brand.name,
      brand: results.brand,
      brand_products: results.brand_products,
    };
    res.render('brand_detail', renderObj);
  });
};

// Display Brand create form on GET
exports.brand_create_get = function(req, res) {
  const renderObj = {
    title: "Create Brand",
  };
  res.render('brand_form', renderObj);
};

exports.brand_create_post = [

  // Validate and sanitiaze the name field
  body('name', 'Brand name is required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a brand object with the escaped and trimmed data.
    var brand = new Brand({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const renderObj = {
        title: 'Create Brand',
        brand: brand,
        errors: errors.array()
      };

      res.render('brand_form', renderObj);
      return;

    } else {
      // Data from form is valid
      // Check if Brand with the same name already exists
      Brand.findOne({ 'name': req.body.name })
        .exec( function(err, found_brand) {
          if (err) { return next(err); }

          if (found_brand) {
            // Brand Exists, redirect to it's detail page
            res.redirect(found_brand.url);

          } else {
            brand.save(function (err) {
              if (err) { return next(err); }
              // Brand saved. Redirect to the new Brand's detail page
              res.redirect(brand.url);
            });
          }
        });
    }
  }
];

// Display Brand delete form on GET
exports.brand_delete_get = function(req, res) {
  res.send('NOT Implemented: Brand Delete GET');
};

// Handle Brand delete on POST
exports.brand_delete_post = function(req, res) {
  res.send('NOT Implemented: Brand delete POST');
};

// Display Brand update form on GET
exports.brand_update_get = function(req, res) {
  res.send('NOT Implemented: Brand update GET');
};

// Handle Brand update on POST
exports.brand_update_post = function(req, res) {
  res.send('NOT Implemented: Brand update POST');
};

