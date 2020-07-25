"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Service.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      Service.belongsTo(models.Category, {
        foreignKey: "categoryId",
        onDelete: "CASCADE",
      });

      Service.hasMany(models.Bid, {
        foreignKey: "serviceId",
      });

      Service.belongsTo(models.Status, {
        foreignKey: "statusId",
        onDelete: "CASCADE",
      });

      Service.hasOne(models.Job, {
        foreignKey: "serviceId",
      });
    }
  }
  Service.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      budget: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      terms: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      county: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      town: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Service",
    }
  );
  return Service;
};
