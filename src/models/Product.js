const { Schema, model } = require("mongoose");

const ProductsSchema = new Schema(
  {
    brand: {
      type: Schema.ObjectId,
      ref: "Brands",
      required: false,
    },

    brandName: {
      type: String,
    },

    for: {
      type: String,
      require: true,
    },

    productType: [
      {
        label: String,
        query: String,
      },
    ],

    title: {
      type: String,
      require: true,
    },

    rating: {
      type: Number,
    },

    votes: {
      type: Number,
    },

    price: {
      type: Number,
      require: true,
    },

    sale: {
      type: Number,
    },

    colour: {
      type: String,
      require: true,
    },

    sizes: {
      type: [
        {
          mainSize: {
            type: String,
            require: true,
          },
          size: {
            type: String,
            require: true,
          },
          inStock: {
            type: Boolean,
            require: true,
          },
          amount: {
            type: Number,
            require: true,
          },
        },
      ],
      require: true,
    },

    details: {
      title: {
        type: String,
      },
      list: {
        type: [String],
      },
    },

    productCode: {
      type: Number,
      require: true,
    },

    sizeAndFit: {
      modelWears: {
        type: String,
      },
      modelHeight: {
        type: String,
      },
      comment: {
        type: String,
      },
    },

    about: {
      label: {
        type: String,
      },
      texture: {
        type: String,
      },
      comment: {
        type: String,
      },
    },

    media: {
      pictures: [String],
      video: {
        src: String,
      },
    },

    newIn: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Products = model("Products", ProductsSchema);

module.exports = Products;
