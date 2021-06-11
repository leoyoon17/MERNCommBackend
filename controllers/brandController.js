// TODO

var Brand = require('../models/brand');
var Product = require('../models/product');

const async = require('async');
const { body, validationResult } = require("express-validator");
const ProductInstance = require('../models/productInstance');

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

// Handle Brand create on POST
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
exports.brand_delete_get = function(req, res, next) {

  // When we remove the brand, we have to also delete products related to the
  // brand.
  async.parallel({
    brand: function(callback) {
      Brand.findById(req.params.id).exec(callback);
    },

    brand_products: function(callback) {
      Product.find({ 'brand': req.params.id }).exec(callback);
    },

  }, function(err, results) {
    if (err) { return next(err); }

    // No results.
    if (results.brand==null) {
      res.redirect('/catalog/brands');
    }

    const renderObj = {
      title: 'Delete Brand',
      brand: results.brand,
      brand_products: results.brand_products,
    }

    res.render('brand_delete', renderObj);
  });
};

// Display Brand CASCADE delete form on GET
exports.brand_cascade_delete_get = function(req, res, next) {

  // When we remove the brand, we have to also delete products related to the
  // brand.
  async.parallel({
    brand: function(callback) {
      Brand.findById(req.params.id).exec(callback);
    },

    brand_products: function(callback) {
      Product.find({ 'brand': req.params.id }).exec(callback);
    },

  }, function(err, results) {
    if (err) { return next(err); }

    // No results.
    if (results.brand==null) {
      res.redirect('/catalog/brands');
    }

    const renderObj = {
      title: 'Delete Brand',
      brand: results.brand,
      brand_products: results.brand_products,
    }

    res.render('brand_cascade_delete', renderObj);
  });
};

// Handle Brand delete on POST (Deletes only the brand but leaves any
// of the brand's products intact)
exports.brand_delete_post = function(req, res) {

  Brand.findById(req.body.brandId)
    .exec(function(err, results) {
      if (err) { return next(err); }

      // Success, delete brand but leave the children products.
      Brand.findByIdAndRemove(req.body.brandId, function deleteBrand(err) {
        if (err) { return next(err); }

        // Success, redirect
        res.redirect('/catalog/brands');
      });
    });
  
  
};

// Handle Brand CASCADE delete on post (Deletes the brand and any related
// product and its instances.)
exports.brand_cascade_delete_post = function (req, res) {
  
  async.parallel({
    brand: function(callback) {
      Brand.findById(req.body.brandId).exec(callback);
    },

    brand_products: function(callback) {
      Product.find({ 'brand': req.body.brandId }).exec(callback);
    }

  }, function(err, results) {
    if (err) { return next(err); }

    // Success

    // First, remove ProductInstances and Products of the brand
    console.log(results.brand_products);

    // Removing productInstances of each product of the brand
    results.brand_products.forEach(function (product) {
      ProductInstance.deleteMany({ 'product': product._id }, function (err, results) {
        if (err) { return next(err); }

        console.log("ProductInstances Removed: " + results);

        // After removing instances of a product, remove the product itself
        Product.findByIdAndRemove(product._id, function(err) {
          if (err) { return next(err); }
        });
      });
    });

    // Finally, delete the brand
    Brand.findByIdAndRemove(req.body.brandId, function deleteBrand(err) {
      if (err) { return next(err); }

      // Success, redirect
      res.redirect('/catalog/brands');
    });
  });
}

// Display Brand update form on GET
exports.brand_update_get = function(req, res, next) {

  // Retrieve Brand
  Brand.findById(req.params.id, function (err, result) {
    if (err) { return next(err); }

    // No result
    if (result==null) {
      var err = new Error('Brand not found');
      err.status = 404;
      return next(err);
    }

    // Success
    const renderObj = {
      title: 'Update Brand',
      brand: result,
    };

    res.render('brand_form', renderObj);
  });

};

// Handle Brand update on POST
exports.brand_update_post = [
  
  body('name', 'Name must not be empty').trim().isLength({ min: 1}).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from the request
    const errors = validationResult(req);

    // Create a Brand object with escaped/trimmed data and OLD id
    var brand = new Brand({
      name: req.body.name,
      _id: req.params.id // This is required, or a new ID will be assigned
    });

    if (!errors.isEmpty()) {
      // There are some errors. Render form again with sanitized values/error messages

      const renderObj = {
        title: 'Update Product',
        brand: brand,
        errors: errors.array(),
      };

      res.render('brand_form', renderObj);
    } else {
      // Data from form is valid. Update the record
      Brand.findByIdAndUpdate(req.params.id, brand, {}, function(err, myBrand) {
        if (err) { return next(err); }

        // Successful - redirect to product detail page

        res.redirect(myBrand.url);
      });
    }
  }
];