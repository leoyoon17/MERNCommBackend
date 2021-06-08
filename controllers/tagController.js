// TODO

var Tag = require('../models/tag');
var Product = require('../models/product');


var async = require('async');

// Display List of tags
exports.tag_list = function(req, res) {
  Tag.find({}, 'name')
    .exec(function (err, list_tags) {
      if (err) { return next(err); }
      // Success, so render
      res.render('tag_list', { title: 'Tag List', tag_list: list_tags});
    });

};

// Display detail for a specific tag
exports.tag_detail = function(req, res) {

  async.parallel({
    tag: function(callback) {
      Tag.findById(req.params.id)
        .exec(callback);
    },

    tag_products: function(callback) {
      Product.find({ 'tag': req.params.id })
        .exec(callback);
    },

  }, function(err, results) {
    if (err) { return next(err); }
    if (results.tag==null) { // No results
      var err = new Error('Tag not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    var renderObj = {
      title: results.tag.name,
      tag: results.tag,
      tag_products: results.tag_products,
    };

    res.render('tag_detail', renderObj);
  });
};

// Display Tag create form on GET
exports.tag_create_get = function(req, res) {
  res.send('NOT Implemented: Tag Create GET');
};

// Handle Tag Create on POST
exports.tag_create_post = function(req, res) {
  res.send('NOT Implemented: Tag Create POST');
};

// Display Tag Delete form on GET
exports.tag_delete_get = function(req, res) {
  res.send('NOT Implemented: Tag Delete GET');
};

// Handle Tag Delete on POST
exports.tag_delete_post = function(req, res) {
  res.send('NOT Implemented: Tag Delete POST');
};

// Display Tag update form on GET
exports.tag_update_get = function(req, res) {
  res.send('NOT Implenented: Tag Update Get');
};

// Handle Tag update on POST
exports.tag_update_post = function(req, res) {
  res.send('NOT Implemented: Tag Update Post');
};