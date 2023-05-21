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
  const filterArr = await Product.aggregate([
    { $match: req.userBaseQuery },
    {
      $project: {
        productType: 1,
        sizes: 1,
        brand: 1,
      },
    },
    {
      $unwind: "$sizes",
    },
    {
      $unwind: "$productType",
    },
    {
      $group: {
        _id: null,
        brands: { $addToSet: "$brand" },
        sizes: { $addToSet: "$sizes.size" },
        productTypes: {
          $addToSet: {
            _id: "$productType.query",
            label: "$productType.label",
            query: "$productType.query",
          },
        },
      },
    },
    {
      $lookup: {
        as: "brands",
        from: "brands",
        foreignField: "_id",
        localField: "brands",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },
  ]);

  const sort = [
    { label: "new", query: "createdAt" },
    { label: "price high to low", query: "-price" },
    { label: "price low to high", query: "price" },
  ];

  const filter = {
    sort,
    brands: filterArr[0]?.brands || [],
    sizes: filterArr[0]?.sizes || [],
    productTypes: filterArr[0]?.productTypes || [],
  };

  res.status(200).json(filter);
});
