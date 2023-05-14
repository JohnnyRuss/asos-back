const mongoose = require("mongoose");

exports.generateUserBaseQuery = async function (req, res, next) {
  const { search_for, search_in, search } = req.query;

  function generateNestedQuery(userQuery, searchByBrand = false) {
    if (userQuery === "new-in") return { newIn: true };
    else {
      const query = {
        "productType.query":
          userQuery === "all"
            ? { $regex: "" }
            : { $in: [...userQuery?.split(",")] },
      };

      if (searchByBrand) {
        const ids = userQuery
          ?.split(",")
          .filter((q) => mongoose.Types.ObjectId.isValid(q));

        return {
          $or: [query, { brand: ids }],
        };
      } else return query;
    }
  }

  req.userBaseQuery = {
    $or: [{ for: search_for }, { for: "all" }],
    $and: [
      generateNestedQuery(search_in || ""),
      generateNestedQuery(search || "", true),
    ],
  };

  next();
};
