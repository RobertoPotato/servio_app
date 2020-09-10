"use strict";

const { actualMin, maxUsers, maxAlerts } = require("../constants");
const faker = require("faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const alerts = [...Array(maxAlerts)].map((alert) => ({
      createdBy: faker.random.number({ min: actualMin, max: maxUsers }),
      title: faker.lorem.sentence(),
      payload: faker.lorem.sentence(),
      createdFor: faker.random.number({ min: actualMin, max: maxUsers }),
      isSeen: false,
      type:
        faker.random.number({ min: actualMin, max: maxUsers }) % 2 === 0
          ? "JOBS"
          : "MY_SERVICES",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Alerts", alerts, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Alerts", null, {});
  },
};
