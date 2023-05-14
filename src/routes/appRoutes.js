const express = require("express");
const {
  updateProductType,
  getBrands,
  addBrandFig,
  updateProductsTypes,
} = require("../controllers/appController");

const router = express.Router();

router.route("/brands").get(getBrands);

router.route("/brands/:brandId").post(addBrandFig);

router.route("/:productId").put(updateProductType);

router.route("/").put(updateProductsTypes);

module.exports = router;
