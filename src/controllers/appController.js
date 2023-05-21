const Async = require("../lib/async");
const AppError = require("../lib/AppError");
const Brand = require("../models/Brands");
const Product = require("../models/Product");

// const brandsData = require("../../public/assets/brands.json");
const productsData = require("../../public/assets/products.json");

exports.updateProductType = Async(async function (req, res, next) {
  const { productId } = req.params;
  const { types } = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $addToSet: { productType: types },
    },
    { new: true }
  );

  res.status(201).json({ data: updatedProduct.productType });
});

exports.getBrands = Async(async function (req, res, next) {
  const brands = await Brand.find({ fig: "" }).select("name fig");
  res.status(200).json({ resulst: brands.length, data: brands });
});

exports.addBrandFig = Async(async function (req, res, next) {
  const { brandId } = req.params;
  const { fig } = req.body;

  const updatedBrand = await Brand.findByIdAndUpdate(
    brandId,
    { $set: { fig: fig } },
    { new: true }
  ).select("name fig");

  res.status(200).json(updatedBrand);
});

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

async function arrayCreator(data, schema) {
  await Promise.all(data.map(async (b) => await schema.create(b)));
}

async function createBrand() {
  // await Promise.all(brandsData.map(async (b) => await Brand.create(b)));
  await Brand.create({
    name: "dickies",
    fig: "",
    history:
      "Dickies is the definition of a heritage brand. C.N. Williamson and EE 'Colonel' Dickie began their careers in the vehicle and harness business in 1918. They clubbed together to buy an overall company that would become <b>Dickies<b> in 1922. Known for its hardwearing staples, <b>Dickies<b> range of T-shirts, sweatshirts and tops are available in sizes up to XXXL.",
  });
}

// createBrand()

async function createProducts() {
  const data = productsData.map((pr) => ({
    ...pr,
    media: {
      pictures: pr.media.pictures.map((p) => p.replace(".", "")),
      video: {
        src: pr.media.video.src.replace(".", ""),
      },
    },
  }));

  await arrayCreator(data, Product);
}

// createProducts();

async function generateRatingAndVotes() {
  const random_1_5 = () => (Math.random() * 5).toFixed(1);
  const random_1_1000 = () => Math.floor(Math.random() * 1000);
  await (
    await Product.find()
  ).map(async (item) =>
    Product.findByIdAndUpdate(item._id, {
      $pull: { productType: "clothing" },
    })
  );
}

exports.updateProductsTypes = Async(async function (req, res, next) {
  // let brands = await Brand.find();
  // brands = brands
  //   .map((b) => b.name.toLowerCase())
  //   .concat(["asos design", "other stories", "pull-and-bear"]);
  const black_list = [
    "coats-and-jackets",
    "t-shirts-and-vests",
    "jumpers-and-cardigans",
    "hoodies-and-vests",
    "suits-and-tailoring",
    "trousers-and-chinos",
    "lingerie-and-nightwear",
    "tracksuits-and-joggers",
    "hoodies-and-sweatshirts",
    "jumpsuits-and-playsuits",
    "shirts-and-blouses",
    "swimwear-and-Beachwear",
    "trousers-and-leggings",
    "curve-and-plus size",
    "modest",
    "fashion",
    "linen",
    "ski-and-snowboard",
    "bridesmaid",
    "slip",
    "trousers-and-tights",
    "yoga-and-studio",
  ];
  const products = await Product.find();
  products.map(async (p) => {
    if (p.productType.some((t) => black_list.includes(t.query))) {
      p.productType = p.productType.filter(
        (t) => !black_list.includes(t.query)
      );
      // .map((t) => ({
      //   label: t.label,
      //   query: t.query.split(" ").join("-"),
      // }));
      await p.save({ validateBeforeSave: false });
    }
  });

  // await Product.updateMany({ $set: { "productType._id": undefined } });

  res.status(200).json({ products });
});

// updateProducts();
