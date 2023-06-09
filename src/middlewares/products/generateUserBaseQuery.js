exports.generateUserBaseQuery = async function (req, res, next) {
  const { search_for, search_in, search } = req.query;

  function generateNestedQuery(userQuery) {
    const query = {};

    if (userQuery === "new-in") query.newIn = true;
    else {
      userQuery === "all"
        ? (query["productType.query"] = { $regex: "" })
        : (query["$or"] = [
            { "productType.query": userQuery?.split(",") },
            { brandName: userQuery?.split(",") },
          ]);
    }

    return query;
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
