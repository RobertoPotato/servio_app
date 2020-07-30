"use strict";

const faker = require("faker");
const { maxStatuses } = require("../constants");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const statuses = [...Array(maxStatuses)].map((status) => ({
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Statuses", statuses, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Statuses", null, {});
  },
};
