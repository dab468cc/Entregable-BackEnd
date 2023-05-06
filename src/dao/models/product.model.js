const mongoose = require("mongoose");

const collection  = "Products"

const productSchema = new mongoose.Schema({
  title: { type: String, },
  description: { type: String, },
  category: { type: String, },
  status: { typer: Boolean, },
  price: { type: Number, },
  code: { type: Number, },
  stock: { type: Number, },
  thumbnails: [],
});

const productsModel = mongoose.model(collection, productSchema);

module.exports = productsModel;
