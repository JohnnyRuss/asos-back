const { Schema, model } = require("mongoose");

const BrandsSchema = new Schema({
  name: { type: String, require: true },
  fig: { type: String, require: true },
  history: { type: String, require: true },
});

const Brand = model("Brands", BrandsSchema);

module.exports = Brand;
