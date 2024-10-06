import { Dispatch, SetStateAction, useCallback, useState } from "react";

export const useList = <T extends { id?: number }>(
  option: IOptions<T> = {}
): returnType<T> => {
  const { initialValue, updateCallback, checkExisting } = option;
  const [list, setList] = useState<T[]>(initialValue || []);

  const updateList = useCallback(
    (data: T) => {
      if (
        list.some((item) =>
          checkExisting ? checkExisting(item, data) : item.id === data.id
        )
      ) {
        setList((prevState) =>
          prevState.map((item) => {
            if (updateCallback) {
              return updateCallback(item, data);
            }
            return item.id === data.id ? { ...item, ...data } : item;
          })
        );
      } else {
        setList((prevState) => [data, ...prevState]);
      }
    },
    [list]
  );

  const deleteItem = useCallback(
    (id: number) => {
      setList((prevState) => prevState.filter((item) => item.id !== id));
    },
    [list]
  );

  return [list, setList, updateList, deleteItem];
};

interface IOptions<T> {
  initialValue?: T[];
  updateCallback?: (item: T, newItem: T) => T;
  checkExisting?: (item: T, newItem: T) => boolean;
}

type returnType<T> = [
  T[],
  Dispatch<SetStateAction<T[]>>,
  (data: T) => void,
  (id: number) => void,
];
