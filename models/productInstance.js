const mongoose = require('mongoose');

const ProductInstanceSchema = new mongoose.Schema({
  // Reference to associated product
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  
});

// Virtual for ProductInstanc's URL
ProductInstanceSchema
  .virtual('url')
  .get(function () {
    return 'catalog/productInstance' + this._id;
  });
  
const ProductInstance = mongoose.model('ProductInstance', ProductInstanceSchema);

module.exports = ProductInstance;