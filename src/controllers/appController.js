const Async = require("../lib/async");
const AppError = require("../lib/AppError");
const Brand = require("../models/Brands");
const Product = require("../models/Product");

// const brandsData = require("../../public/assets/brands.json");
const productsData = require("../../public/assets/products.json");

// compass
// {productType:{$regex:"jumpsuits"}}

exports.getProducts = Async(async function (req, res, next) {
  const products = await Product.find().populate({ path: "brand" });

  res.status(200).json(products);
});

exports.getProduct = Async(async function (req, res, next) {
  const { productId } = req.params;
  const product = await Product.findById(productId).populate({ path: "brand" });

  res.status(200).json(product);
});

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
    name: "only & sons",
    fig: "",
    history:
      "Quality craftsmanship is at the forefront of Danish brand <b>Only & Sons<b>, whose signature designs include classic knitwear, relaxed sweats and denim. Using a range of high quality fabrics, theirs is a seamlessly crafted collection for laid-back style.",
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
  // await Product.deleteMany()
}

// createProducts();

// clothing -->
// type --> sportswear
// fit --> outdoors
// brands -->

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

async function updateProducts() {
  // await generateRatingAndVotes();
  // await Product.updateMany({ $addToSet: { productType: "clothing" } });
  await Product.updateMany(
    { brand: { $exists: true } },
    { $addToSet: { productType: "brands" } }
  );
  // await Product.updateMany({ $unset: { isNew: "" } });
  // const products = await Product.find();
  // products.map(async (prod, i) => {
  //   if (i % 2 === 0)
  //     await Product.findByIdAndUpdate(prod._id, { $set: { newIn: false } });
  // });
}
// updateProducts();
