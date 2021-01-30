const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Collection = sequelize.define('collection', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'collection',
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
  Collection.associate = function (models) {
    Collection.belongsTo(models.user, {foreignKey: 'authorId'});
  }
  return Collection
};
