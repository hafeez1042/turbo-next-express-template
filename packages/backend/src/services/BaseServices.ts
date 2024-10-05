import { IQueryStringParams } from "@repo/types/lib/types";
import { Sequelize } from "sequelize";
import { IBaseRepository } from "../repositories/IBaseRepository";
import { NotFoundError } from "../errors/NotFoundError";
import { IBaseServices } from "./IBaseServices";

export class BaseServices<T> implements IBaseServices<T> {
  protected repository: IBaseRepository<T>;
  constructor(repository: IBaseRepository<T>) {
    this.repository = repository;
  }

  getAll = async (query: IQueryStringParams) => {
    const items = await this.repository.getAll(query);
    return items;
  };

  create = async (data: T) => {
    const item = await this.repository.create(data);
    return item;
  };

  getById = async (id: number) => {
    const item = await this.repository.getById(id);
    if (!item) throw new NotFoundError();
    return item;
  };
  update = async (id: number, data: Partial<T>) => {
    const item = await this.repository.update(id, data);
    if (!item) throw new NotFoundError();
    return item;
  };

  delete = async (id: number) => {
    await this.repository.delete(id);
    return;
  };
}
