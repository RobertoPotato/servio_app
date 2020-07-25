'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //remove if it causes problems
      Status.hasMany(models.Service, {
        foreignKey: "statusId",
      });

      Status.hasMany(models.Job, {
        foreignKey: "statusId",
      });
    }
  };
  Status.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Status',
  });
  return Status;
};