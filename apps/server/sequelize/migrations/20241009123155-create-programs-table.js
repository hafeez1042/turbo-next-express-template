'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('programs', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: true, // Code is optional as per the interface
        unique: true, // Assuming `code` should be unique
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'clients', // References the clients table
          key: 'id',
        },
        onUpdate: 'CASCADE', // Update behavior
        onDelete: 'CASCADE', // Delete behavior
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_by: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('programs');
  },
};

