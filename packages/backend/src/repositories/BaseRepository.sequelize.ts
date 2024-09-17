import {
  Model,
  Transaction,
  Op,
  WhereOptions,
  DatabaseError,
  Includeable,
} from "sequelize";
import {
  IQueryStringParams,
  IVersionedModelAttribute,
} from "@repo/types/lib/types";
import { getData, getDataArray } from "../utils/sequelize/sequelizeUtils";
import { MakeNullishOptional } from "sequelize/types/utils";
import { generateSequelizeQuery } from "../utils/sequelize/generateSequelizeQuery";
import { ConflictError } from "../errors/ConflictError";
import { v4 as uuidv4 } from "uuid";
import { InternalServerError } from "../errors/InternalServerError";
export abstract class BaseRepository<
  TModelAttributes extends IVersionedModelAttribute,
  TCreationAttributes extends {} = TModelAttributes,
> {
  protected model: typeof Model &
    (new () => Model<TModelAttributes, TCreationAttributes>);
  protected versioning: boolean;

  protected getByIdIncludeable: Includeable[] = [];
  protected getByOneIncludeable: Includeable[] = [];
  protected getAllIncludeable: Includeable[] = [];
  protected historyIncludeable: Includeable[] = [];

  protected constructor(
    model: typeof Model &
      (new () => Model<TModelAttributes, TCreationAttributes>),
    versioning = false
  ) {
    this.model = model;
    this.versioning = versioning;
  }

  async create(
    data: MakeNullishOptional<TCreationAttributes>
  ): Promise<TModelAttributes> {
    if (!data) {
      throw new Error("Invalid data");
    }
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      if (this.versioning) {
        // Set initial version and active flag
        const item_id = uuidv4();
        (data as IVersionedModelAttribute).version = 1;
        (data as IVersionedModelAttribute).is_active = true;
        (data as IVersionedModelAttribute).id = item_id;
        (data as IVersionedModelAttribute).source_item_id = item_id;
      }
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

      if (this.versioning) {
        // Deactivate the current version
        const entryData: TModelAttributes = getData(entry);
        await entry.update({ is_active: false } as Partial<TModelAttributes>, {
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
          newVersionData as unknown as MakeNullishOptional<TCreationAttributes>,
          {
            transaction,
          }
        );
        await transaction.commit();
        return getData(newEntry);
      } else {
        const updatedEntry = await entry.update(data, { transaction });
        await transaction.commit();
        return getData(updatedEntry);
      }
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

      if (this.versioning) {
        // Soft delete: mark as inactive or set a deleted flag
        await entry.update(
          {
            is_active: false,
            deleted_at: new Date(),
            deleted_by: deletedBy,
          } as Partial<TModelAttributes>,
          { transaction }
        );
        await entry.destroy({ transaction });
      } else {
        await entry.destroy({ transaction });
      }

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
        ...this.versionFilter(),
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
      const versionedData = this.versioning
        ? data.map((item) => {
            const item_id = uuidv4();
            return {
              ...item,
              version: 1, // Set initial version to 1
              is_active: true, // Set the initial active state
              id: item_id,
              source_item_id: item_id,
            } as MakeNullishOptional<TCreationAttributes>;
          })
        : data;

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

        if (this.versioning) {
          // Deactivate current version and create a new one
          await entry.update(
            { is_active: false } as Partial<TModelAttributes>,
            { transaction }
          );
          const entryData: TModelAttributes = getData(entry);
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
            newVersionData as unknown as MakeNullishOptional<TCreationAttributes>,
            {
              transaction,
            }
          );
          updatedEntries.push(getData(newEntry));
        } else {
          const updatedEntry = await entry.update(item, { transaction });
          updatedEntries.push(getData(updatedEntry));
        }
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
      if (this.versioning) {
        // Soft delete: mark all entries as inactive
        await this.model.update(
          {
            is_active: false,
            deleted_at: new Date(),
          } as Partial<TModelAttributes>,
          {
            where: {
              id: { [Op.in]: data },
            } as WhereOptions,
            transaction,
          }
        );
      } else {
        await this.model.destroy({
          where: {
            id: { [Op.in]: data },
          } as WhereOptions,
          transaction,
        });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  protected versionFilter() {
    return this.versioning ? { is_active: { [Op.not]: false } } : {};
  }

  protected getSearchQuery = (searchText: string) => {
    return {
      [Op.or]: [
        { name: { [Op.like]: `%${searchText}%` } },
        // { description: { [Op.like]: `%${searchText}%` } },
        // { keywords: { [Op.like]: `%${searchText}%` } },
        // { notes: { [Op.like]: `%${searchText}%` } },
        // { metadata: { [Op.like]: `%${searchText}%` } },
      ],
    };
  };

  async history(
    sourceItemId: string,
    include?: boolean
  ): Promise<TModelAttributes[]> {
    if (!this.versioning) {
      throw new Error("Versioning is not enabled for this repository.");
    }

    const versions = await this.model.findAll({
      include: include ? this.historyIncludeable : undefined,
      where: {
        [Op.or]: { source_item_id: sourceItemId, id: sourceItemId },
      } as WhereOptions<TModelAttributes>,
      order: [["version", "ASC"]], // Order by version number
    });

    return getDataArray(versions);
  }
}
