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
      Address.belongsTo(models.Service, {
        foreignKey: "serviceId",
        onDelete: "CASCADE",
      });
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
      },
      serviceId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};

//TODO make email in user model unique
//TODO make phone number in profile unique 
