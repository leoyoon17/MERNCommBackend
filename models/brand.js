const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: {
          type: String,
          required: true,
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