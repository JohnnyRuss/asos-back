const AppError = require("./AppError");

function errorController(err, req, res, next) {
  const error = destructureError(err);

  if (error.name === "CastError") error = handleDBCastError(error);
  if (error.name === "ValidationError") error = handleDBValidationError(error);
  if (error.code === 11000) error = handleDBDuplicateFieldError(error);

  if (process.env.DEV_MODE === "PROD") {
    sendProductionError(res, error);
  } else {
    sendDevelopmentError(res, error);
  }
}

function destructureError(err) {
  const status = err.status || "error";
  const statusCode = err.statusCode || 500;
  const name = err.name;
  const message = err.message || "SERVER ERROR";
  const stack = err.stack;

  return {
    status,
    statusCode,
    name,
    message,
    stack,
  };
}

// _id error
function handleDBCastError(error) {
  const message = `Invalid ${error.path}:${error.value}`;
  return new AppError(400, message);
}

function handleDBValidationError(error) {
  const errors = error.errors;

  const invalidInputs = Object.values(errors).map((err) => err.message);

  const message = `Invalid input data. ${invalidInputs.join(". ")}`;

  return new AppError(400, message);
}

function handleDBDuplicateFieldError(error) {
  const keyValue = error?.keyValue;
  const [key, value] = Object.entries(keyValue)?.[0];

  const message = `Duplicate ${key} field value:${value}. Please use another ${key}.`;

  return new AppError(400, message);
}

///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////

function sendDevelopmentError(res, error) {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stack: error.stack,
  });
}

function sendProductionError(res, error) {
  if (error.isOperational)
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  else {
    console.error("error 💥", error);
    res.status(500).json({
      status: "error",
      message: error.message || "something went very wrong ! 💥",
    });
  }
}

module.exports = errorController;
