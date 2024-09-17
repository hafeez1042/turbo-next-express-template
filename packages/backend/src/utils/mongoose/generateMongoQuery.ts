import { FilterQuery } from "mongoose";
import { IFieldFilter } from "@repo/types/lib/types";

export const createMongoQuery = (filter?: IFieldFilter, searchQuery?: FilterQuery<any>): FilterQuery<any> => {
  if(!filter && !searchQuery) return  {};

  let query: FilterQuery<any> = {};

  if(searchQuery) {
    query = searchQuery;
  }

  for (const field in filter) {
    if (filter.hasOwnProperty(field)) {
      const filterOptions = filter[field];
      const fieldQuery: FilterQuery<any> = {};

      for (const key in filterOptions) {
        if (filterOptions.hasOwnProperty(key)) {
          const value = filterOptions[key];
          switch (key) {
            case 'startsWith':
              fieldQuery[field] = new RegExp(`^${value}`);
              break;
            case 'contains':
              fieldQuery[field] = new RegExp(value, 'i');
              break;
            case 'endsWith':
              fieldQuery[field] = new RegExp(`${value}$`);
              break;
            case 'eq':
              fieldQuery[field] = value;
              break;
            case 'neq':
              fieldQuery[field] = { $ne: value };
              break;
            case 'lt':
              fieldQuery[field] = { $lt: value };
              break;
            case 'lte':
              fieldQuery[field] = { $lte: value };
              break;
            case 'gt':
              fieldQuery[field] = { $gt: value };
              break;
            case 'gte':
              fieldQuery[field] = { $gte: value };
              break;
            case 'in':
              fieldQuery[field] = { $in: value };
              break;
            case 'nin':
              fieldQuery[field] = { $nin: value };
              break;
          }
        }
      }

      // Combine field queries using AND
      Object.assign(query, fieldQuery);
    }
  }

  return query;
}
