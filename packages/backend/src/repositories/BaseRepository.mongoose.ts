import { IQueryStringParams } from "@repo/types/lib/types";
import mongoose, {
  FilterQuery,
  HydratedDocument,
  Model,
  ObjectId,
  UpdateQuery,
} from "mongoose";
import { createMongoQuery } from "../utils/mongoose/generateMongoQuery";
import { getMongoObjectId } from "../utils/mongoose/getMongoObjectId";
import { IBaseRepository } from "./IBaseRepository";

export abstract class BaseRepository<
  T,
  TDoc extends HydratedDocument<any>,
  I = mongoose.Types.ObjectId,
> implements IBaseRepository<T, I>
{
  protected model: Model<TDoc>;

  protected constructor(model: Model<TDoc>) {
    this.model = model;
  }

  public getAll = async (
    queryParams: Omit<IQueryStringParams, "cursor"> = {}
  ) => {
    const searchQuery =
      this.getSearchQuery && queryParams.q
        ? this.getSearchQuery(queryParams.q)
        : undefined;

    const mongoQuery = createMongoQuery(queryParams?.filter, searchQuery);
    let query = this.model.find(mongoQuery);

    query = this.applyQueryModifiers(query, queryParams);

    const items = await query.exec();
    return items.map((item) => item.toObject() as T);
  };

  public getAllWithCursor = async (
    queryParams: IQueryStringParams = {},
    cursorComparison: "lt" | "gt" = "gt"
  ) => {
    const searchQuery =
      this.getSearchQuery && queryParams.q
        ? this.getSearchQuery(queryParams.q)
        : undefined;

    const mongoQuery = createMongoQuery(queryParams?.filter, searchQuery);
    if (queryParams.cursor) {
      mongoQuery._id = {
        [cursorComparison === "lt" ? "&lt" : "$gt"]: getMongoObjectId(
          queryParams.cursor
        ),
      };
    }
    let query = this.model.find(mongoQuery);

    query = this.applyQueryModifiers(query, queryParams);

    const items = await query.exec();

    const lastItem =
      items.length >= (queryParams?.limit || 0)
        ? items[items.length - 1]
        : null;
    const nextCursor = lastItem ? (lastItem._id as ObjectId).toString() : null;

    return {
      items: items.map((item) => item.toObject() as T),
      nextCursor,
    };
  };

  private applyQueryModifiers(
    query: mongoose.Query<any, any>,
    queryParams: IQueryStringParams
  ) {
    if (queryParams.skip) query.skip(queryParams.skip);
    query.limit(queryParams.limit ?? 100);
    if (queryParams.orderBy) {
      query.sort({
        [queryParams.orderBy]: queryParams.order === "dsc" ? -1 : 1,
      });
    }
    return query;
  }

  public getById = async (id: I) => {
    const item = await this.model.findById(id);
    return item ? (item.toObject() as T) : null;
  };

  public findOne = async (queryParams: IQueryStringParams) => {
    const mongoQuery = createMongoQuery(queryParams?.filter);
    const item = await this.model.findOne(mongoQuery);
    return item ? (item.toObject() as T) : null;
  };

  public create = async (data: Partial<T>) => {
    const item = await this.model.create(data);
    return item.toObject() as T;
  };

  public update = async (
    id: I | undefined,
    data: Partial<T>,
    upsert?: boolean
  ) => {
    if (!id && !upsert) {
      throw new Error("Update operation requires an ID or upsert flag.");
    }

    const options = { new: true, upsert };
    if (id) {
      const updatedItem = await this.model.findOneAndUpdate(
        { _id: id },
        { $set: data as UpdateQuery<T> },
        options
      );
      return updatedItem ? (updatedItem.toObject() as T) : null;
    } else {
      return await this.create(data);
    }
  };

  public delete = async (id: I) => {
    await this.model.deleteOne({ _id: id });
  };

  public bulkCreate = async (data: Partial<T>[]) => {
    const items = await this.model.insertMany(data);
    return items.map((item) => item as T);
  };

  // Bulk update method
  public updateMany = async (
    filter: IQueryStringParams, // Filter to find the documents
    updateData: Partial<T> // Data to update
  ) => {
    const update = { $set: updateData as UpdateQuery<T> };
    await this.model.updateMany(createMongoQuery(filter.filter), update, {
      multi: true,
    });
  };

  public bulkUpdate = async (updateData: (Partial<T> & { id: string })[]) => {
    for (const item of updateData) {
      const update = { $set: updateData as UpdateQuery<T> };
      await this.model.updateOne({ _id: item.id }, update);
    }
  };

  // Bulk delete method
  public bulkDelete = async (filter: IQueryStringParams) => {
    const result = await this.model.deleteMany(createMongoQuery(filter.filter));
    return result; // Result contains metadata (e.g., deletedCount)
  };

  public abstract getSearchQuery?: (searchString: string) => FilterQuery<TDoc>;
}
