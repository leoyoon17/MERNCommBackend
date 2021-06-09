const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String,
          required: true,
          maxLength: 100
        },
  
  brand: {  type: mongoose.Schema.Types.ObjectId,
            ref:  'Brand',
            required: true,
  },

  price:  { type: Number,
            required: true,
            min: 0.00,
          },

  description:  { type: String,
                  required: true,
                  maxLength: 3000
                },

  status: {
            type: String,
            required: true,
            enum: ['Available', 'Out of Stock'],
            default: 'Available',
          },

  tag:  [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tag'
        }],
});

// Virtual for Product's URL
ProductSchema
  .virtual('url')
  .get(function () {
    return '/catalog/product/' + this._id;
  });

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;