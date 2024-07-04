import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "@repo/types/lib/schema/user";
import { IRole, RolesEnum } from "@repo/types/lib/schema/role";

interface IUserDoc extends Omit<IUser, "_id">, Document {}
interface IRoleDoc extends Omit<IRole, "_id">, Document {}

export const RoleSchema: Schema<IRoleDoc> = new Schema({
  _id: { type: String, required: true },
  name: { type: String, enum: RolesEnum, required: true },
  permissions: { type: [String], required: false }, // Not using at the moment
});

const UserSchema: Schema<IUserDoc> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    cognitoUsername: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: false },
    phoneNumber: { type: String, required: true },
    roles: { type: [RoleSchema], required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    updatedBy: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model<IUserDoc>("User", UserSchema);
