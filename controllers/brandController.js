// TODO

var Brand = require('../models/brand');
var Product = require('../models/product');

var async = require('async');


// Display list of all brands
exports.brand_list = function(req, res) {
  Brand.find({}, 'name')
    .sort([['name', 'ascending']])
    .exec(function (err, list_brands) {
      if (err) { return next(err); }
      // Success, so render

      res.render('brand_list', { title: 'Brand List', brand_list: list_brands});
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
      brand_products: results.prand_products,
    };
    res.render('brand_detail', renderObj);
  });
};

// Display Brand create form on GET
exports.brand_create_get = function(req, res) {
  res.send('NOT Implemented: Brand Create GET');
};

exports.brand_create_post = function(req, res) {
  res.send('NOT Implemented: Brand Create POST');
};

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

