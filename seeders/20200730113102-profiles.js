"use strict";

const {
  maxUsers,
  actualMin,
  maxTiers,
  maxAddresses,
  maxRoles,
  maxProfiles,
} = require("../constants");
const faker = require("faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const profiles = [...Array(maxProfiles)].map((profile) => ({
      bio: faker.lorem.paragraph(),
      picture: faker.image.imageUrl(),
      avatar: faker.image.avatar(),
      phoneNumber: faker.phone.phoneNumber(),
      isVerified: faker.random.boolean(), //
      userId: faker.random.number({ min: actualMin, max: maxUsers }), //* generates fake whole numbers in given range
      tierId: faker.random.number({ min: actualMin, max: maxTiers }),
      roleId: faker.random.number({ min: actualMin, max: maxRoles }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Profiles", profiles, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Profiles", null, {});
  },
};
