"use strict";

const faker = require("faker");
const { maxRoles } = require("../constants");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = [...Array(maxRoles)].map((role) => ({
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return queryInterface.bulkInsert("Roles", roles);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
