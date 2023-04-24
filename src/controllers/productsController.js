const Async = require("../lib/async");
const AppError = require("../lib/AppError");
const Brand = require("../models/Brands");
const Product = require("../models/Product");

exports.getProducts = Async(async function (req, res, next) {
  const { search_for, search_in, search } = req.query;

  const results = await Product.find({
    $or: [{ for: search_for }, { for: "all" }],
    $and: [
      {
        [search_in === "new in" ? "newIn" : "productType.query"]:
          search_in === "new in"
            ? true
            : search_in === "all"
            ? { $regex: "" }
            : { $in: [search_in] },
      },
      {
        [search === "new in" ? "newIn" : "productType.query"]:
          search === "new in"
            ? true
            : search === "all" || !search
            ? { $regex: "" }
            : { $in: [search] },
      },
    ],
  }).sort({ createdAt: -1 });

  res.status(200).json(results);
});

exports.getProduct = Async(async function (req, res, next) {
  const { productId } = req.params;

  const product = await Product.findById(productId).populate({ path: "brand" });

  if (!product) return next(new AppError(404, "Product does not exists"));

  res.status(200).json(product);
});
