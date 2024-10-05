import {
  Model,
  Transaction,
  WhereOptions,
  DatabaseError,
  Includeable,
} from "sequelize";
import { Op } from "sequelize/lib/operators";
import { v4 as uuidv4 } from "uuid";
import { MakeNullishOptional } from "sequelize/types/utils";

import { IQueryStringParams } from "@repo/types/lib/types";
import { IVersionedBaseAttributes } from "@repo/types/lib/types.sql";

import { getData, getDataArray } from "../utils/sequelize/sequelizeUtils";
import { generateSequelizeQuery } from "../utils/sequelize/generateSequelizeQuery";
import { ConflictError } from "../errors/ConflictError";
import { InternalServerError } from "../errors/InternalServerError";
import { IBaseRepository } from "./IBaseRepository";

export abstract class BaseRepository<T extends IVersionedBaseAttributes>
  implements IBaseRepository<T>
{
  protected model: typeof Model & (new () => Model<T, T>);

  protected getByIdIncludeable: Includeable[] = [];
  protected findOneIncludeable: Includeable[] = [];
  protected getAllIncludeable: Includeable[] = [];
  protected historyIncludeable: Includeable[] = [];

  protected constructor(model: typeof Model & (new () => Model<T, T>)) {
    this.model = model;
  }

  async getAll(query: IQueryStringParams): Promise<T[]> {
    const sequelizeQuery = generateSequelizeQuery(query, this.getSearchQuery);
    const whereOptions = sequelizeQuery?.where || {};

    const results = await this.model.findAll({
      include: this.getAllIncludeable.length
        ? this.getAllIncludeable
        : undefined,
      order: sequelizeQuery.order,
      where: {
        ...whereOptions,
        ...this.versionFilter(),
      } as WhereOptions<T>,
    });
    return getDataArray(results);
  }

  async getAllWithCursor(
    query: IQueryStringParams,
    cursorComparison: "lt" | "gt" = "gt"
  ): Promise<{ items: T[]; nextCursor: number | null }> {
    const sequelizeQuery = generateSequelizeQuery(query, this.getSearchQuery);
    const whereOptions = sequelizeQuery?.where || {};

    if (query.cursor) {
      // Assuming cursor is a string representing an ID
      const cursorValue = query.cursor;
      // Modify the where clause to get results after the cursor value
      whereOptions[cursorComparison === "gt" ? Op.gt : Op.lt] = {
        id: cursorValue,
      }; // Adjust this according to your cursor logic
    }

    const results = await this.model.findAll({
      include: this.getAllIncludeable.length
        ? this.getAllIncludeable
        : undefined,
      order: sequelizeQuery.order,
      where: {
        ...whereOptions,
        ...this.versionFilter(),
      } as WhereOptions<T>,
      limit: query.limit, // Limit should still be applied
    });
    const items = getDataArray(results) as T[];

    const lastItem =
      items.length >= (query?.limit || 0) ? items[items.length - 1] : null;
    const nextCursor = lastItem ? lastItem.id : null;

    return {
      items,
      nextCursor: nextCursor || null,
    };
  }

  async getById<TWithDetails = T>(
    id: number,
    included?: boolean
  ): Promise<TWithDetails | null> {
    const response = await this.model.findByPk(id, {
      include: this.getByIdIncludeable.length
        ? this.getByIdIncludeable
        : undefined,
    });
    return response ? getData(response) : null;
  }

  async create(data: T): Promise<T> {
    if (!data) {
      throw new Error("Invalid data");
    }
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      // Set initial version and active flag
      (data as IVersionedBaseAttributes).version = 1;
      (data as IVersionedBaseAttributes).is_active = true;
      const response: Model<T, T> = await this.model.create(
        data as unknown as MakeNullishOptional<T>,
        { transaction }
      );
      await transaction.commit();
      return getData(response);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      let entry = await this.model.findByPk(id, { transaction });
      if (!entry) {
        await transaction.rollback();
        throw new Error("Not Found");
      }

      // Deactivate the current version
      const entryData = getData(entry) as T & IVersionedBaseAttributes;

      const updateValues = {
        is_active: false,
      } as Partial<T & IVersionedBaseAttributes>;

      await entry.update(updateValues, {
        transaction,
      });

      const source_item_id = entryData.source_item_id || entryData.id;
      // Create a new version
      delete entryData.id;
      delete entryData.created_at;

      const newVersionData = {
        ...entryData,
        ...data,
        version: (entryData.version || 0) + 1,
        source_item_id,
        is_active: true,
      };
      const newEntry = await this.model.create(
        newVersionData as unknown as MakeNullishOptional<T>,
        {
          transaction,
        }
      );
      await transaction.commit();
      return getData(newEntry);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateMany(
    query: IQueryStringParams,
    updateData: Partial<T>
  ): Promise<void> {
    throw new Error("Update many not supported in versioned table");
  }

  async delete(id: number, deletedBy?: string): Promise<void> {
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      const entry = await this.model.findByPk(id);
      if (!entry) {
        throw new Error("Not Found");
      }

      // Soft delete: mark as inactive or set a deleted flag
      const updateValues = {
        is_active: false,
        deleted_at: new Date(),
        deleted_by: deletedBy,
      } as Partial<T & IVersionedBaseAttributes>;
      await entry.update(updateValues, { transaction });
      await entry.destroy({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      if (
        (error as DatabaseError).name === "SequelizeForeignKeyConstraintError"
      ) {
        throw new ConflictError(
          "Conflict: Unable to delete the resource as it is referenced by another resource."
        );
      }
      throw error;
    }
  }

  async bulkDelete(query: IQueryStringParams): Promise<void> {
    await this.model.destroy(generateSequelizeQuery(query));
  }

  async findOne(query: IQueryStringParams): Promise<T | null> {
    const results = await this.model.findOne({
      include: this.findOneIncludeable.length
        ? this.findOneIncludeable
        : undefined,
      ...generateSequelizeQuery(query, this.getSearchQuery),
    });

    if (!results) {
      return null;
    }
    return getData(results);
  }

  async bulkCreate(data: MakeNullishOptional<T>[]): Promise<T[]> {
    if (!data || data.length === 0) {
      throw new Error("Invalid data");
    }
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      const versionedData = data.map((item) => {
        const item_id = uuidv4();
        return {
          ...item,
          version: 1, // Set initial version to 1
          is_active: true, // Set the initial active state
          id: item_id,
          source_item_id: item_id,
        } as MakeNullishOptional<T>;
      });

      const responses = await this.model.bulkCreate(versionedData, {
        transaction,
      });
      await transaction.commit();
      return getDataArray(responses);
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw new InternalServerError();
    }
  }

  async bulkUpdate(data: (Partial<T> & { id: string })[]) {
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      const updatedEntries: MakeNullishOptional<Partial<T>>[] = [];

      for (const item of data) {
        const entry = await this.model.findByPk(item.id, { transaction });

        if (!entry) {
          throw new Error(`Not Found: ${item.id}`);
        }

        // Deactivate current version and create a new one
        const updateValues = {
          is_active: false,
        } as Partial<T & IVersionedBaseAttributes>;
        await entry.update(updateValues, { transaction });
        const entryData = getData(entry) as T & IVersionedBaseAttributes;
        const source_item_id = entryData.source_item_id || entryData.id;

        delete entryData.id;
        delete entryData.updated_at;
        delete entryData.updated_by;

        const newVersionData = {
          ...entryData,
          ...item,
          version: (entryData.version || 0) + 1,
          is_active: true,
          source_item_id,
        };
        const newEntry = await this.model.create(
          newVersionData as unknown as MakeNullishOptional<T>,
          {
            transaction,
          }
        );
        updatedEntries.push(getData(newEntry));
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  protected versionFilter() {
    return { is_active: { [Op.not]: false } };
  }

  abstract getSearchQuery: (searchText: string) => WhereOptions<T>;

  async history(sourceItemId: string): Promise<T[]> {
    const versions = await this.model.findAll({
      include: this.historyIncludeable.length
        ? this.historyIncludeable
        : undefined,
      where: {
        [Op.or]: { source_item_id: sourceItemId, id: sourceItemId },
      } as WhereOptions<T>,
      order: [["version", "ASC"]], // Order by version number
    });

    return getDataArray(versions);
  }
}
