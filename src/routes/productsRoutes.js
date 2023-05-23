const express = require("express");
const {
  getProducts,
  getProduct,
  getProductsFilter,
  getRelatedProducts,
} = require("../controllers/productsController");
const {
  generateUserBaseQuery,
} = require("../middlewares/products/generateUserBaseQuery");

const router = express.Router();

router.route("/").get(generateUserBaseQuery, getProducts);

router.route("/filter").get(generateUserBaseQuery, getProductsFilter);

router.route("/:productId").get(getProduct);

router.route("/:productId/related").get(getRelatedProducts);

module.exports = router;
