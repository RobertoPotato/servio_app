"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Address.hasOne(models.Profile, {
      //   foreignKey: "userId",
      //   onDelete: "CASCADE",
      // });
    }
  }
  Address.init(
    {
      county: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      town: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      long: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};
