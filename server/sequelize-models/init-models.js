var DataTypes = require("sequelize").DataTypes;
var _collection = require("./collection");
var _item = require("./item");
var _photo = require("./photo");
var _tag = require("./tag");
var _user = require("./user");

function initModels(sequelize) {
  var collection = _collection(sequelize, DataTypes);
  var item = _item(sequelize, DataTypes);
  var photo = _photo(sequelize, DataTypes);
  var tag = _tag(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  return {
    collection,
    item,
    photo,
    tag,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
