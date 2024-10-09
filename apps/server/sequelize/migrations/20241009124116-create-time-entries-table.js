'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('time_entries', {
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
        onDelete: 'CASCADE', // Delete time entries if the project is deleted
      },
      task_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'tasks', // References the tasks table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Delete time entries if the task is deleted
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users', // References the users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Delete time entries if the user is deleted
      },
      hours: {
        type: Sequelize.FLOAT, // Using FLOAT to allow for partial hours
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('time_entries');
  },
};
