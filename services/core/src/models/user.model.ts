import { DataTypes, Model, Optional } from "sequelize";
import { IUser, UserStatusEnum } from "@repo/types/lib/schema/user";
import sequelize from "../config/database";

interface UserCreationAttributes
  extends Optional<IUser, "id" | "created_at" | "updated_at"> {}

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: number;
  public full_name!: string;
  public email!: string;
  public avatar_url?: string;
  public status?: UserStatusEnum;

  public created_by?: number;
  public updated_by?: number;
  public deleted_at?: Date;
  public deleted_by?: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
    },
    avatar_url: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(UserStatusEnum)),
      defaultValue: UserStatusEnum.ACTIVE,
    },
    created_by: {
      type: DataTypes.BIGINT,
    },
    updated_by: {
      type: DataTypes.BIGINT,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
    deleted_by: {
      type: DataTypes.BIGINT,
    },
  },
  {
    sequelize,
    tableName: "users",
    underscored: true,
    paranoid: true, // For soft deletes
  }
);

export default User;
