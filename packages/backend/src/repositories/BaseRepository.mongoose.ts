//Repository.ts
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

export abstract class BaseRepository<
  T,
  TDoc extends HydratedDocument<any>,
  I = mongoose.Types.ObjectId,
> {
  protected model: Model<TDoc>;

  protected constructor(model: Model<TDoc>) {
    this.model = model;
  }

  public getAll = async (
    queryParams: Omit<IQueryStringParams, "cursor"> = {},
    populate?: string | string[]
  ) => {
    const searchQuery =
      this.getSearchQuery && queryParams.q
        ? this.getSearchQuery(queryParams.q)
        : undefined;

    const mongoQuery = createMongoQuery(queryParams?.filter, searchQuery);
    let query = this.model.find(mongoQuery);

    query = this.applyQueryModifiers(query, queryParams);

    if (populate) {
      query.populate(populate);
    }

    const items = await query.exec();
    return items.map((item) => item.toObject());
  };

  public getAllWithCursor = async (
    queryParams: IQueryStringParams = {},
    cursorComparison: "$lt" | "$gt" = "$gt",
    populate?: string | string[]
  ) => {
    const searchQuery =
      this.getSearchQuery && queryParams.q
        ? this.getSearchQuery(queryParams.q)
        : undefined;

    const mongoQuery = createMongoQuery(queryParams?.filter, searchQuery);
    if (queryParams.cursor) {
      mongoQuery._id = {
        [cursorComparison]: getMongoObjectId(queryParams.cursor),
      };
    }
    let query = this.model.find(mongoQuery);

    query = this.applyQueryModifiers(query, queryParams);

    if (populate) {
      query.populate(populate);
    }

    const items = await query.exec();

    const lastItem =
      items.length >= (queryParams?.limit || 0)
        ? items[items.length - 1]
        : null;
    const nextCursor = lastItem ? (lastItem._id as ObjectId).toString() : null;

    return {
      items: items.map((item) => item.toObject()),
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

  public getById = async (id: I | string) => {
    const item = await this.model.findById(id);
    return item ? item.toObject() : null;
  };

  public findOne = async (queryParams: IQueryStringParams) => {
    const mongoQuery = createMongoQuery(queryParams?.filter);
    const item = await this.model.findOne(mongoQuery);
    return item ? item.toObject() : null;
  };

  public create = async (data: Partial<T>) => {
    const item = await this.model.create(data);
    return item.toObject();
  };

  public updateById = async (
    id: I | string | undefined,
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
      return updatedItem ? updatedItem.toObject() : null;
    } else {
      return await this.create(data);
    }
  };

  public findAndUpdate = async (
    findQueryParams: IQueryStringParams,
    updateData: Partial<T>
  ) => {
    const mongoQuery = createMongoQuery(findQueryParams?.filter);
    const update = { $set: updateData as UpdateQuery<T> };

    await this.model.updateMany(mongoQuery, update);
  };

  public deleteById = async (id: I | string) => {
    await this.model.deleteOne({ _id: id });
  };

  public delete = async (
    query: IQueryStringParams | I | string,
    many?: boolean
  ) => {
    if (mongoose.isValidObjectId(query) || typeof query === "string") {
      await this.model.findById(query).deleteOne();
    } else {
      const mongoQuery = createMongoQuery((query as IQueryStringParams).filter);
      if (many) {
        await this.model.deleteMany(mongoQuery);
      } else {
        await this.model.deleteOne(mongoQuery);
      }
    }
  };

  public abstract getSearchQuery?: (searchString: string) => FilterQuery<any>;
}
