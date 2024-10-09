'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_users', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      project_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'projects', // References the projects table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Delete project-user entry if the project is deleted
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users', // References the users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Delete project-user entry if the user is deleted
      },
      allocation_start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      allocation_end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      allocation_hours: {
        type: Sequelize.FLOAT, // Using FLOAT to allow for decimal hours
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      project_role_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'project_roles', // References the project_roles table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Delete project-user entry if the project role is deleted
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
    await queryInterface.dropTable('project_users');
  },
};