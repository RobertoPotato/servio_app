"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bid.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      Bid.belongsTo(models.Service, {
        foreignKey: "serviceId",
        onDelete: "CASCADE",
      });

      Bid.hasOne(models.Job, {
        foreignKey: "bidId",
      });
    }
  }
  Bid.init(
    {
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      coverLetter: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      canTravel: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      availability: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: DataTypes.INTEGER,
      serviceId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Bid",
    }
  );
  return Bid;
};
