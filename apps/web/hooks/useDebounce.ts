import { useRef, useEffect } from "react";
import debounce from "lodash/debounce";

export const useDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ReturnType<typeof debounce> => {
  const debounceRef = useRef<ReturnType<typeof debounce>>(
    debounce(func, delay),
  );

  useEffect(() => {
    debounceRef.current = debounce(func, delay);
  }, [func, delay]);

  return debounceRef.current;
};
