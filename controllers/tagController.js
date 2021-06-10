// TODO

var Tag = require('../models/tag');
var Product = require('../models/product');


const async = require('async');
const { body, validationResult } = require("express-validator");

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
  const renderObj = {
    title: 'Create Tag',
  }
  res.render('tag_form', renderObj);
};

// Handle Tag Create on POST
exports.tag_create_post = [
  
  // Validate and sanitize the name field
  body('name', 'Tag name is required').trim().isLength({ min: 1}).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a tag object with escaped and trimmed data.
    var tag = new Tag({ name: req.body.name});

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const renderObj = {
        title: 'Create Tag',
        tag: tag,
        errors: errors.array()
      };
      res.render('tag_form', renderObj);
      return;

    }
    else {
      // Data from form is valid
      // Check if Tag with the same name already exists
      Tag.findOne({ 'name': req.body.name})
        .exec( function(err, found_tag) {
          if (err) { return next(err); }

          if (found_tag) {
            // Tag exists, redirect to it's detail page.
            res.redirect(found_tag.url);

          } else {
            tag.save(function (err) {
              if (err) { return next(err); }
              // Tag saved. Redirect to new Tag's detail page
              res.redirect(tag.url);
            });

          }

        });
    }
  }
];

// Display Tag Delete form on GET
exports.tag_delete_get = function(req, res, next) {
  Tag.findById(req.params.id).exec(function(err, result) {
    if (err) { return next(err); }

    const renderObj = {
      title: 'Delete Tag',
      tag: result
    };

    res.render('tag_delete', renderObj);
  });
};

// Handle Tag Delete on POST
exports.tag_delete_post = function(req, res, next) {
  Tag.findByIdAndRemove(req.body.tagId).exec(function(err, result) {
    if (err) { return next(err); }

    res.redirect('/catalog/tags');
  });
};

// Display Tag update form on GET
exports.tag_update_get = function(req, res) {
  res.send('NOT Implenented: Tag Update Get');
};

// Handle Tag update on POST
exports.tag_update_post = function(req, res) {
  res.send('NOT Implemented: Tag Update Post');
};