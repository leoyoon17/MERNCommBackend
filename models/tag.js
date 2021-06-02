const mongoose = require('mongoose');

const TagSchema = mongoose.Schema({
  name: {
          type: String,
          required: true,
          minLength: 3,
          maxLength: 100,
        },
});

TagSchema
  .virtual('url')
  .get(function () {
    return '/catalog/tag/' + this._id;
  });

const Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;