"use strict";

const faker = require("faker");
const { maxUsers } = require("../constants");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [...Array(maxUsers)].map((user) => ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(8),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return queryInterface.bulkInsert("Users", users);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
