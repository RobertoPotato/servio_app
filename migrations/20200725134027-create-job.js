"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Jobs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      clientId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id",
          as: "clientId",
        },
      },
      agentId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id",
          as: "agentId",
        },
      },
      bidId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Bids",
          key: "id",
          as: "bidId",
        },
      },
      serviceId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Services",
          key: "id",
          as: "serviceId",
        },
      },
      statusId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Statuses",
          key: "id",
          as: "statusId",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Jobs");
  },
};
