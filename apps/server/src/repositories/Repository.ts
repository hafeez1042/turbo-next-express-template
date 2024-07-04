//Repository.ts
import { IQueryStringParams } from "@repo/types/lib/types";
import mongoose, {
  FilterQuery,
  HydratedDocument,
  Model,
  ObjectId,
} from "mongoose";
import { createMongoQuery } from "../utils/generateMongoQuery";
import { getMongoObjectId } from "../utils/getMongoObjectId";

export abstract class Repository<
  T,
  TDoc extends HydratedDocument<any>,
  I = mongoose.Types.ObjectId,
> implements IRepository<T, TDoc, I>
{
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
    return items.map(this.accessor);
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
      items: items.map(this.accessor),
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
    return item ? this.accessor(item) : null;
  };

  public findOne = async (queryParams: IQueryStringParams) => {
    const mongoQuery = createMongoQuery(queryParams?.filter);
    const item = await this.model.findOne(mongoQuery);
    return item ? this.accessor(item) : null;
  };

  public create = async (data: Partial<T>) => {
    const item = await this.model.create(this.mutator(data));
    return this.accessor(item);
  };

  public update = async (
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
        { $set: this.mutator(data) },
        options
      );
      return updatedItem ? this.accessor(updatedItem) : null;
    } else {
      return await this.create(data);
    }
  };

  public findAndUpdate = async (
    findQueryParams: IQueryStringParams,
    updateData: Partial<T>
  ) => {
    const mongoQuery = createMongoQuery(findQueryParams?.filter);
    const update = { $set: this.mutator(updateData) };

    await this.model.updateMany(mongoQuery, update);
  };

  public deleteById = async (id: I | string) => {
    await this.model.deleteOne({ _id: id });
  };

  public delete = async (query: IQueryStringParams | I | string, many?: boolean) => {
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

  public abstract accessor(data: TDoc): T;

  public abstract mutator(data: Partial<T>): Partial<TDoc>;

  public abstract getSearchQuery?: (searchString: string) => FilterQuery<any>;
}

export interface IRepository<T, TDoc, I> {
  getAll: (
    query: IQueryStringParams,
    populate?: string | string[]
  ) => Promise<T[]>;
  getById: (id: I) => Promise<T | null>;
  findOne: (query: IQueryStringParams) => Promise<T | null>;
  create: (data: T) => Promise<T>;
  update: (
    id: I | string | undefined,
    data: Partial<T>,
    upsert?: boolean
  ) => Promise<T | null>;
  findAndUpdate: (
    findQueryParams: IQueryStringParams,
    updateData: Partial<T>
  ) => Promise<void>;
  deleteById: (id: I) => Promise<void>;
  delete: (query: IQueryStringParams) => Promise<void>;

  accessor: (data: HydratedDocument<TDoc>) => T;

  mutator: (data: Partial<T>) => Partial<TDoc>;

  getSearchQuery?: (searchString: string) => FilterQuery<any>;
}
