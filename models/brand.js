const mongoose = require('mongoose');

const Product = require('./product');
const ProductInstance = require('./productInstance');

const BrandSchema = new mongoose.Schema({
  name: {
          type: String,
          required: true,
          minLength: 3,
          maxLength: 100
        },
});

// Virtual for brand's URL?
BrandSchema
  .virtual('url')
  .get(function () {
    return '/catalog/brand/' + this._id;
  });
  


const Brand = mongoose.model("Brand", BrandSchema);

module.exports = Brand;