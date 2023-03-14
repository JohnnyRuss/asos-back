require("dotenv").config();
const App = require("./app");
const mongoose = require("mongoose");

const { createServer } = require("http");

const SERVER = createServer(App);

const PORT = process.env.PORT;
const APP_CONNECTION = process.env.DB_APP_CONNECTION;

process.on("uncaughtException", (err) => {
  console.log("uncaughtException ! process is exited 💥👀", err.message);
  process.exit(1);
});

mongoose.set("strictQuery", false);
mongoose
  .connect(APP_CONNECTION)
  .then(() => {
    console.log(`DB Is CONNECTED Successfully ⚡✔`);
    SERVER.listen(PORT, () => {
      console.log(`App Listens On PORT > ${PORT} < ✨🎉`);
    });
  })
  .catch(() => {
    process.on("unhandledRejection", (err) => {
      console.log("Unhandled Rejection, server is closed 💥👀", err.message);
      SERVER.close(() => process.exit(1));
    });
  });
