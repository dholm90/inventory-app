const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  numberInStock: { type: Number, requried: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' }
})

ItemSchema.virtual('url').get(function () {
  return `/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);
