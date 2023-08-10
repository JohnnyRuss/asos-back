exports.generateUserBaseQuery = async function (req, res, next) {
  const { search_for, search_in, search } = req.query;

  function generateNestedQuery(userQuery) {
    const query = {};

    if (userQuery === "new-in") query.newIn = true;
    else {
      userQuery === "all"
        ? (query["productType.query"] = { $regex: "" })
        : (query["$or"] = [
            ...userQuery
              ?.split(",")
              .flatMap((q) => [{ "productType.query": q }, { brandName: q }]),
          ]);
    }

    return query;
  }

  req.userBaseQuery = {
    for: search_for,
    $and: [
      generateNestedQuery(search_in || "all"),
      generateNestedQuery(search || "all"),
    ],
  };

  next();
};
