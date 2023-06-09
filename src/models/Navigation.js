const { Schema, model } = require("mongoose");

const NavigationSchema = new Schema({
  label: String,
  route: String,
  nestedNav: {
    type: [
      {
        listType: {
          enum: ["TEXT_ONLY", "ROUNDED_FIG_X", "ROUNDED_FIG_Y", "FIG_ONLY"],
        },
        title: String,
        routes: {
          type: {
            men: [
              {
                label: String,
                route: String,
                fig: String,
              },
            ],
            women: [
              {
                label: String,
                route: String,
                fig: String,
              },
            ],
          },
        },
      },
    ],
  },
});

const Navigation = model("Navigation", NavigationSchema);
module.exports = Navigation;
