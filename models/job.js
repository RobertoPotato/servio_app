"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {

    //! Look into the users table and determine which one gets fetched during eaerloading the data for a Job
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //TODO Add the 'as' directive
      //* 'as' directive added
      Job.belongsTo(models.User, {
        as: "client",
        foreignKey: "clientId",
        onDelete: "CASCADE",
      });

      Job.belongsTo(models.User, {
        as: "agent",
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
