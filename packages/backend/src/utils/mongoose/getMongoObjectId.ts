import mongoose from "mongoose";

export const getMongoObjectId = <T>(id: T) => {
  if (!id) return undefined;
  if (typeof id === "string") return new mongoose.Types.ObjectId(id as string);
  return id as unknown as mongoose.Types.ObjectId;
};

export const getMongoObjectIdArray = <T>(ids?: T[]) => {
  if (!ids) return undefined;

  return ids.map(getMongoObjectId) as mongoose.Types.ObjectId[];
};
