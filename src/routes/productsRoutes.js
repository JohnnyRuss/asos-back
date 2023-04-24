const express = require("express");
const {
  getProducts,
  getProduct,
} = require("../controllers/productsController");

const router = express.Router();

router.route("/").get(getProducts);

router.route("/:productId").get(getProduct);

module.exports = router;
