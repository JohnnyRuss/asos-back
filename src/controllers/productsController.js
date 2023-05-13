const Async = require("../lib/async");
const AppError = require("../lib/AppError");
const Brand = require("../models/Brands");
const Product = require("../models/Product");

exports.getProducts = Async(async function (req, res, next) {
  const results = await Product.find({
    ...req.userBaseQuery,
  }).sort({ createdAt: -1 });

  res.status(200).json(results);
});

exports.getProduct = Async(async function (req, res, next) {
  const { productId } = req.params;

  const product = await Product.findById(productId).populate({ path: "brand" });

  if (!product) return next(new AppError(404, "Product does not exists"));

  res.status(200).json(product);
});

exports.getProductsFilter = Async(async function (req, res, next) {
  const productTypes = await Product.find({
    ...req.userBaseQuery,
  }).distinct("productType");

  const sizes = await Product.find({
    ...req.userBaseQuery,
  }).distinct("sizes.size");

  let brands = await Product.find({
    ...req.userBaseQuery,
  }).distinct("brand");
  brands = await Brand.find({ _id: brands }).select("-history -fig -__v");

  const sort = [
    { label: "new", query: "createdAt=1" },
    { label: "price high to low", query: "price=1" },
    { label: "price low to high", query: "price=-1" },
  ];

  res.status(200).json({
    productTypes,
    sizes,
    brands,
    sort,
  });
});
