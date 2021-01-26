const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    realm: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    emailVerified: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    verificationToken: {
      type: DataTypes.STRING(512),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user',
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
};
