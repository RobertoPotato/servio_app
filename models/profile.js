"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      Profile.belongsTo(models.Tier, {
        foreignKey: "tierId",
        onDelete: "CASCADE",
      });

      Profile.belongsTo(models.Role, {
        foreignKey: "roleId",
        onDelete: "CASCADE",
      });
    }
  }
  Profile.init(
    {
      bio: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: DataTypes.INTEGER,
      tierId: DataTypes.INTEGER,
      addressId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );
  return Profile;
};
