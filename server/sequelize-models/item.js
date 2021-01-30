const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const item = sequelize.define('item', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    breed: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    collectionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'collection',
        key: 'id',
      },
    },
  }, {
    sequelize,
    tableName: 'item',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  item.associate = function (models) {
    item.belongsTo(models.collection);
  }
  return item
};
