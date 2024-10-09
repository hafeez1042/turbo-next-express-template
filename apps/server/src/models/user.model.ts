import { Model, DataTypes, Association } from "sequelize";
import { EmployeeStatusEnum, IUser } from "@repo/types/lib/schema/user";
import { sequelize } from "../helpers/sequelize";
import { DepartmentModel } from "./department.model";
import { DesignationModel } from "./designation.model";

// Define the Sequelize User model
export class UserModel extends Model<IUser> {
  public id!: number;
  public full_name!: string;
  public email!: string;
  public employee_id!: number;
  public mobile?: string;
  public date_of_joining?: Date;
  public relieved_date?: Date;
  public settlement_date?: Date | null;
  public department_id?: number;
  public designation_id?: number;
  public manager_id?: number;
  public image_url?: string;
  public status?: EmployeeStatusEnum;
  public created_by?: number;
  public updated_by?: number;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;
  public deleted_by?: number;

  public static associations: {
    department: Association<UserModel, DepartmentModel>;
    designation: Association<UserModel, DesignationModel>;
    manager: Association<UserModel, UserModel>;
  };
}

// Initialize the User model
UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    employee_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_of_joining: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    relieved_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    settlement_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    department_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "departments", // References the departments table
        key: "id",
      },
    },
    designation_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "designations", // References the designations table
        key: "id",
      },
    },
    manager_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "users", // Self-reference the users table for managers
        key: "id",
      },
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(EmployeeStatusEnum)),
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
    tableName: "users",
    timestamps: true,
    paranoid: true, // Enables soft deletes (deleted_at)
  }
);

UserModel.belongsTo(DepartmentModel, {
  foreignKey: "department_id",
  as: "department",
});

UserModel.belongsTo(DesignationModel, {
  foreignKey: "designation_id",
  as: "designation",
});

UserModel.belongsTo(UserModel, {
  foreignKey: "manager_id",
  as: "manager",
});
