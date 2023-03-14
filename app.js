const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const errorController = require("./src/lib/errorController");
const AppError = require("./src/lib/AppError");

const appRoutes = require("./src/routes/appRoutes");
const productsRoutes = require("./src/routes/productsRoutes");

const App = express();

App.use(express.json());
App.use(express.urlencoded({ extended: false }));
App.use(express.static(path.join(__dirname, "public/assets")));

App.use(cookieParser());

App.use(
  cors({
    credentials: true,
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      if (origin !== process.env.CLIENT_ORIGIN) {
        const msg = `This site ${origin} does not have an access on API. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }

      return cb(null, true);
    },
  })
);

process.env.DEV_MODE === "DEV" && App.use(morgan("dev"));

App.use("/api/v1/app", appRoutes);
App.use("/api/v1/products", productsRoutes);

App.all("*", (req, res, next) => {
  next(new AppError(404, `can't find ${req.originalUrl} on this server`));
});

App.use(errorController);

module.exports = App;
