import {
  Model,
  Transaction,
  Op,
  WhereOptions,
  DatabaseError,
  Includeable,
} from "sequelize";
import { MakeNullishOptional } from "sequelize/types/utils";

import { IQueryStringParams } from "@repo/types/lib/types";
import { IBaseAttributes } from "@repo/types/lib/types.sql";

import { getData, getDataArray } from "../utils/sequelize/sequelizeUtils";
import { generateSequelizeQuery } from "../utils/sequelize/generateSequelizeQuery";
import { ConflictError } from "../errors/ConflictError";
import { InternalServerError } from "../errors/InternalServerError";

export abstract class BaseRepository<
  TModelAttributes extends IBaseAttributes,
  TCreationAttributes extends {} = TModelAttributes,
> {
  protected model: typeof Model &
    (new () => Model<TModelAttributes, TCreationAttributes>);

  protected getByIdIncludeable: Includeable[] = [];
  protected getByOneIncludeable: Includeable[] = [];
  protected getAllIncludeable: Includeable[] = [];
  protected historyIncludeable: Includeable[] = [];

  protected constructor(
    model: typeof Model &
      (new () => Model<TModelAttributes, TCreationAttributes>)
  ) {
    this.model = model;
  }

  async create(
    data: MakeNullishOptional<TCreationAttributes>
  ): Promise<TModelAttributes> {
    if (!data) {
      throw new Error("Invalid data");
    }
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      const response: Model<TModelAttributes, TCreationAttributes> =
        await this.model.create(data, { transaction });
      await transaction.commit();
      return getData(response);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(
    id: string,
    data: Partial<TModelAttributes>
  ): Promise<TModelAttributes | null> {
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      let entry = await this.model.findByPk(id, { transaction });
      if (!entry) {
        await transaction.rollback();
        throw new Error("Not Found");
      }

      const updatedEntry = await entry.update(data, { transaction });
      await transaction.commit();
      return getData(updatedEntry);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(id: string, deletedBy?: string): Promise<void> {
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      const entry = await this.model.findByPk(id);
      if (!entry) {
        throw new Error("Not Found");
      }

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

  async getById<TWithDetails = TModelAttributes>(
    id: string,
    included?: boolean
  ): Promise<TWithDetails | null> {
    const response = await this.model.findByPk(id, {
      include: included ? this.getByIdIncludeable : undefined,
    });
    return response ? getData(response) : null;
  }

  async deleteByQuery(query: IQueryStringParams): Promise<void> {
    await this.model.destroy(generateSequelizeQuery(query));
  }

  async getAll(
    query: IQueryStringParams,
    included?: boolean
  ): Promise<TModelAttributes[]> {
    const sequelizeQuery = generateSequelizeQuery(query, this.getSearchQuery);
    const whereOptions = sequelizeQuery?.where || {};

    const results = await this.model.findAll({
      include: included ? this.getAllIncludeable : undefined,
      order: sequelizeQuery.order,
      where: {
        ...whereOptions,
      } as WhereOptions<TModelAttributes>,
    });
    return getDataArray(results);
  }

  async getOne(
    query: IQueryStringParams,
    included?: boolean
  ): Promise<TModelAttributes | null> {
    const results = await this.model.findOne({
      include: included ? this.getByOneIncludeable : undefined,
      ...generateSequelizeQuery(query, this.getSearchQuery),
    });

    if (!results) {
      return null;
    }
    return getData(results);
  }

  async bulkCreate(
    data: MakeNullishOptional<TCreationAttributes>[]
  ): Promise<TModelAttributes[]> {
    if (!data || data.length === 0) {
      throw new Error("Invalid data");
    }
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      const responses = await this.model.bulkCreate(data, {
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

  async bulkUpdate(
    data: (MakeNullishOptional<Partial<TModelAttributes>> & { id?: string })[]
  ) {
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      const updatedEntries: MakeNullishOptional<Partial<TModelAttributes>>[] =
        [];

      for (const item of data) {
        const entry = await this.model.findByPk(item.id, { transaction });

        if (!entry) {
          throw new Error(`Not Found: ${item.id}`);
        }

        const updatedEntry = await entry.update(item, { transaction });
        updatedEntries.push(getData(updatedEntry));
      }
      await transaction.commit();
      return updatedEntries;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async bulkDelete(data: string[]) {
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      await this.model.destroy({
        where: {
          id: { [Op.in]: data },
        } as WhereOptions,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  protected abstract getSearchQuery: (
    searchText: string
  ) => WhereOptions<TModelAttributes>;
}
