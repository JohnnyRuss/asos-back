exports.generateUserBaseQuery = async function (req, res, next) {
  const { search_for, search_in, search } = req.query;

  function generateNestedQuery(userQuery) {
    if (userQuery === "new-in") return { newIn: true };
    else
      return {
        "productType.query":
          userQuery === "all"
            ? { $regex: "" }
            : { $in: [...userQuery?.split(",")] },
      };
  }

  req.userBaseQuery = {
    $or: [{ for: search_for }, { for: "all" }],
    $and: [
      generateNestedQuery(search_in || ""),
      generateNestedQuery(search || ""),
    ],
  };

  next();
};
