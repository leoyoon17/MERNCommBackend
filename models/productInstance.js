const mongoose = require('mongoose');

const ProductInstanceSchema = new mongoose.Schema({
  // Reference to associated product
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  
});

const ProductInstance = mongoose.model('ProductInstance', ProductInstanceSchema);

module.exports = ProductInstance;