// TODO

var ProductInstance = require('../models/productInstance');

// Display list of all ProductInstances.
exports.productInstance_list = function(req, res) {
  ProductInstance.find({}, 'product')
    .populate('product')
    .exec(function (err, list_productInstances) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('productInstance_list', { title: 'Product Instance List', productInstance_list: list_productInstances });
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
  res.send('NOT Implemented: ProductInstance Create GET');
};

// Handle ProductInstance Create on POST
exports.productInstance_create_post = function(req, res) {
  res.send('NOT Implemented: ProductInstance Create POST');
};

// Display ProductInstance Delete form on GET
exports.productInstance_delete_get = function(req, res) {
  res.send('NOT Implemented: ProductInstance Delete GET');
};

// Handle ProductInstance Delete on Post
exports.productInstance_delete_post = function(req, res) {
  res.send('NOT Implemented: ProductInstance Delete POST');
};

// Display ProductInstance Update form on GET
exports.productInstance_update_get = function(req, res) {
  res.send('NOT Implemented: ProductInstance Update GET');
};

// Handle ProductInstance Update on POST
exports.productInstance_update_post = function(req, res) {
  res.send('NOT Implemented: ProductInstance Update POST');
};

