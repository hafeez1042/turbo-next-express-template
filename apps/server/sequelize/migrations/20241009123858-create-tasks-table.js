'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estimated_hours: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      additional_hours: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      assigned_to_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users', // References the users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Set to NULL if the user is deleted
      },
      assigned_by_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users', // References the users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Set to NULL if the user is deleted
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled'), // Adjust as needed
        allowNull: false,
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      tech_stack_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'tech_stacks', // References the tech_stacks table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Delete task if the tech stack is deleted
      },
      group_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'groups', // References the groups table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Set to NULL if the group is deleted
      },
      project_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'projects', // References the projects table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Delete task if the project is deleted
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
    await queryInterface.dropTable('tasks');
  },
};