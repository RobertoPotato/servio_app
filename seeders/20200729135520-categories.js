"use strict";
const faker = require("faker");
const { maxCategories } = require("../constants")
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [...Array(maxCategories)].map((category) => ({
      title: faker.commerce.department(),
      description: faker.lorem.sentences(),
      imageUrl: faker.image.imageUrl(),
      themeColor: faker.internet.color(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Categories", categories);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
