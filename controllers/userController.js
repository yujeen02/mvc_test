const userInfo = require("../models/userModels");

const getUser = (req, res) => {
  const users = userInfo.allData();
  res.render("index", { users });
};

module.exports = { getUser };
