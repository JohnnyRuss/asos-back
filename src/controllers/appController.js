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
  // await Product.deleteMany()
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

async function updateProducts() {
  // await generateRatingAndVotes();

  const products = await Product.find();
  products.map(async (product, i) => {
    const newTypes = product.productType.map((type) => {
      const capitalize = (devider, txt) =>
        txt
          .split(devider)
          .map((fr) => fr[0].toUpperCase() + fr.slice(1))
          .join(devider);

      const blackList = ["t-shirts"];

      function generateLabel() {
        let label;

        if (type.includes("-and-")) {
          label = capitalize(" & ", type.replaceAll("-and-", " & "));
        } else if (type.includes("-") && !blackList.includes(type)) {
          label = capitalize(" ", type.replace("-", " "));
        } else {
          label = capitalize(" ", type.replace(" ", " "));
        }

        return label;
      }

      return {
        label: generateLabel(),
        query: type,
      };
    });
    // console.log(newTypes);
    product.productType = newTypes;
    await product.save({ validateBeforeSave: false });
  });
}
// updateProducts();
