import { Model, DataTypes } from "sequelize";
import { IDepartment } from "@repo/types/lib/schema/department";
import { sequelize } from "../helpers/sequelize";


class DepartmentModel extends Model<IDepartment> {
  public id!: number;
  public name!: string;
  public description?: string;
  public created_by?: number;
  public updated_by?: number;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;
  public deleted_by?: number;
}

// Initialize the Department model
DepartmentModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "departments",
    timestamps: true,
    paranoid: true, // Enables soft deletes (deleted_at)
  }
);

// You can define associations here if needed

export { DepartmentModel };
