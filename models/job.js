"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Job.belongsTo(models.User, {
        foreignKey: "clientId",
        onDelete: "CASCADE",
      });

      Job.belongsTo(models.User, {
        foreignKey: "agentId",
        onDelete: "CASCADE",
      });

      Job.belongsTo(models.Bid, {
        foreignKey: "bidId",
        onDelete: "CASCADE",
      });

      Job.belongsTo(models.Service, {
        foreignKey: "serviceId",
        onDelete: "CASCADE",
      });

      Job.belongsTo(models.Status, {
        foreignKey: "statusId",
        onDelete: "CASCADE",
      });
    }
  }
  Job.init(
    {
      clientId: DataTypes.INTEGER,
      agentId: DataTypes.INTEGER,
      bidId: DataTypes.INTEGER,
      serviceId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Job",
    }
  );
  return Job;
};
