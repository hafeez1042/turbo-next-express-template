import { Dispatch, SetStateAction, useCallback, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useList = <T extends Record<string, any>>(
  option: IOptions<T> = {}
): returnType<T> => {
  const {
    initialValue,
    updateCallback,
    checkExisting,
    idColumn = "Id",
    appendToBottom,
  } = option;
  const [list, setList] = useState<T[]>(initialValue || []);

  const updateList = useCallback(
    (value: Partial<T> | Partial<T>[]) => {
      const dataAsArray = Array.isArray(value) ? value : [value];

      dataAsArray.forEach((data) => {
        if (
          list.some((item) => {
            if (checkExisting) {
              return checkExisting(item, data);
            }

            return item[idColumn] === data[idColumn];
          })
        ) {
          setList((prevState) =>
            prevState.map((item) => {
              if (updateCallback) {
                return updateCallback(item, data);
              }

              return item[idColumn] === data[idColumn]
                ? { ...item, ...data }
                : item;
            })
          );
        } else {
          if (appendToBottom) {
            setList((prevState) => [...prevState, data as T]);
          } else {
            setList((prevState) => [data as T, ...prevState]);
          }
        }
      });
    },
    [list]
  );

  const deleteItem = useCallback(
    (id: (string | number) | (string | number)[]) => {
      if (Array.isArray(id)) {
        setList((prevState) =>
          prevState.filter((item) => !id.includes(item[idColumn]))
        );
      } else {
        setList((prevState) =>
          prevState.filter((item) => item[idColumn] !== id)
        );
      }
    },
    [list]
  );

  return [list, setList, updateList, deleteItem];
};

interface IOptions<T> {
  initialValue?: T[];
  updateCallback?: (item: T, newItem: Partial<T>) => T;
  checkExisting?: (item: T, newItem: Partial<T>) => boolean;
  idColumn?: string;
  appendToBottom?: boolean;
}

type returnType<T> = [
  T[],
  Dispatch<SetStateAction<T[]>>,
  /**
   * * @param data - The data to update the list with
   * * @param newVersion @default true -  If false, it will update the existing item
   */
  (data: Partial<T>) => void,
  (id: (string | number) | (string | number)[]) => void
];
