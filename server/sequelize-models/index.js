const Sequelize = require('sequelize');


const sequelize = new Sequelize('catsite_db', 'catsite_db_user', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});

var initModels = require("./init-models");
var models = initModels(sequelize);

module.exports = sequelize;