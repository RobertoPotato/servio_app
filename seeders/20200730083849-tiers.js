"use strict";

const faker = require("faker");
const { maxTiers } = require("../constants");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tiers = [...Array(maxTiers)].map((tier) => ({
      title: faker.lorem.words(),
      description: faker.lorem.sentences(),
      badgeUrl: faker.image.imageUrl(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Tiers", tiers, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Tiers", null, {});
  },
};
