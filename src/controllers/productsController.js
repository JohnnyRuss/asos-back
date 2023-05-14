const Async = require("../lib/async");
const AppError = require("../lib/AppError");
const Brand = require("../models/Brands");
const Product = require("../models/Product");
const API_Features = require("../lib/API_Features");

exports.getProducts = Async(async function (req, res, next) {
  const { query } = new API_Features(
    Product.find({
      ...req.userBaseQuery,
    }),
    req.query
  )
    .sort()
    .flter(["productType", "brand", "size"]);

  const results = await query;

  res.status(200).json(results);
});

exports.getProduct = Async(async function (req, res, next) {
  const { productId } = req.params;

  const product = await Product.findById(productId).populate({ path: "brand" });

  if (!product) return next(new AppError(404, "Product does not exists"));

  res.status(200).json(product);
});

exports.getProductsFilter = Async(async function (req, res, next) {
  // const productTypes = await Product.find({
  //   ...req.userBaseQuery,
  // }).distinct("productType");
  const productTypes = await Product.aggregate([
    { $match: req.userBaseQuery },
    {
      $project: {
        productType: 1,
      },
    },
    {
      $unwind: "$productType",
    },
    {
      $group: {
        _id: "$productType.query",
        label: { $first: "$productType.label" },
        query: { $first: "$productType.query" },
      },
    },
    {
      $sort: { label: 1 },
    },
  ]);

  const sizes = await Product.find({
    ...req.userBaseQuery,
  }).distinct("sizes.size");

  let brands = await Product.find({
    ...req.userBaseQuery,
  }).distinct("brand");
  brands = await Brand.find({ _id: brands }).select("-history -fig -__v");

  const sort = [
    { label: "new", query: "createdAt" },
    { label: "price high to low", query: "-price" },
    { label: "price low to high", query: "price" },
  ];

  res.status(200).json({
    productTypes,
    sizes,
    brands,
    sort,
  });
});
