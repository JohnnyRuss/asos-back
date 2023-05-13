const express = require("express");
const {
  getProducts,
  getProduct,
  getProductsFilter,
} = require("../controllers/productsController");
const {
  generateUserBaseQuery,
} = require("../middlewares/products/generateUserBaseQuery");

const router = express.Router();

router.route("/").get(generateUserBaseQuery, getProducts);

router.route("/filter").get(generateUserBaseQuery, getProductsFilter);

router.route("/:productId").get(getProduct);

module.exports = router;
