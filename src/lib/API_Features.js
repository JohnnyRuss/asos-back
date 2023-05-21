const mongoose = require("mongoose");

class API_Features {
  constructor(query, userQuery) {
    this.query = query;
    this.userQuery = userQuery;
  }

  sort() {
    const sort = this.userQuery.sort;

    if (!sort) this.query.sort("-createdAt");
    else this.query.sort(sort);

    return this;
  }

  flter(whitelist = []) {
    const queryableKeys =
      Object.keys(this.userQuery).filter(
        (key) =>
          whitelist.includes(key) &&
          this.userQuery[key] !== "" &&
          this.userQuery[key] !== undefined
      ) || [];

    const query = {};

    if (queryableKeys.includes("productType"))
      query["productType.query"] = this.userQuery.productType.split(",");

    if (queryableKeys.includes("brand"))
      query["brand"] = this.userQuery.brand
        .split(",")
        .filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (queryableKeys.includes("size"))
      query["sizes.size"] = this.userQuery.size.split(",");

    this.query.find(query);

    return this;
  }
}

module.exports = API_Features;
