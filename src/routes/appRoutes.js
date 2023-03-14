const express = require("express");
const {
  getProducts,
  getProduct,
  updateProductType,
  getBrands,
  addBrandFig,
} = require("../controllers/appController");

const router = express.Router();

router.route("/").get(getProducts);

router.route("/brands").get(getBrands);

router.route("/brands/:brandId").post(addBrandFig);

router.route("/:productId").get(getProduct).put(updateProductType);


module.exports = router;
