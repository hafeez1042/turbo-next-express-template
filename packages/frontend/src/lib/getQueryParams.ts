import {
  IFilerORANDConditions,
  IFilterConditions,
  IQueryStringParams,
} from "@repo/types/lib/types";

export const getQueryParams = ({
  limit,
  q,
  filter,
  orderBy,
  order,
  cursor,
}: IQueryStringParams) => {
  const queryParams: any = {
    filter,
  };

  if (q) {
    queryParams["q"] = q;
  }

  if (limit) {
    queryParams["limit"] = limit;
  }

  if (cursor) {
    queryParams["cursor"] = cursor;
  }

  if (orderBy) {
    queryParams["orderBy"] = orderBy;
    queryParams["order"] = order || "asc";
  }

  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      let filterObj: IFilterConditions = filter[key];
      if (!filterObj) continue;

      if (key === "or" || key === "and") {
        return;
      }

      if (filterObj.startsWith) {
        queryParams.filter[key] = { startsWith: filterObj.startsWith };
      }

      if (filterObj.lt !== null || filterObj.gt !== null) {
        queryParams.filter[key] = queryParams.filter[key] || {};
        if (filterObj.lt !== null) {
          queryParams.filter[key].lt = filterObj.lt;
        }
        if (filterObj.gt !== null) {
          queryParams.filter[key].gt = filterObj.gt;
        }
      }
    }
  }

  return `query=${encodeURIComponent(JSON.stringify(queryParams))}`;
};
