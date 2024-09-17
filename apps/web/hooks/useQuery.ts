import { DependencyList, useEffect, useState, useRef } from "react";
import localForage from "localforage";
interface IOptions<T, R = T, E extends Error = Error> {
  callback?: DataMutator<R>;
  mutator?: (data: T) => R;
  cacheKey?: string;
  refreshInterval?: number;
  /**
   * In ms
   */
  ttl?: number;
  defaultValue?: R;
  resetOnDepChange?: boolean;
  condition?: boolean;
  onError?: (error: E) => void;
}

type DataMutator<T> = (data: T) => void;

export const useQuery = <T = unknown, R = T, E extends Error = Error>(
  promiseOrFunction: (() => Promise<T>) | Promise<T>,
  deps: DependencyList,
  options?: IOptions<T, R>
): [R | undefined, boolean, E] => {
  const prevDeps = useRef<DependencyList>(deps);
  const {
    callback,
    cacheKey,
    refreshInterval,
    ttl = thirtySeconds,
    mutator,
    defaultValue,
    resetOnDepChange,
    condition = true,
    onError,
  } = options || {};
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<R | undefined>(defaultValue);
  const [error, setError] = useState<E>();
  const timeIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (prevDeps.current !== deps && resetOnDepChange) {
      if (callback) callback(undefined);
      setData(undefined);
    }
    prevDeps.current = deps;

    let isCancelled = false;

    const fetchData = async () => {
      if (!condition) {
        setIsLoading(false);
        setData(defaultValue);
        return;
      }
      setIsLoading(true);
      try {
        let responseData: R | undefined;
        // Attempt to retrieve cached data if a cache key is provided
        if (cacheKey) {
          responseData = await getItemWithTTL(cacheKey);
        }

        if (!responseData) {
          // If there's no valid cached data, fetch new data
          const promise =
            typeof promiseOrFunction === "function"
              ? promiseOrFunction()
              : promiseOrFunction;
          if (mutator) {
            responseData = await promise.then(mutator);
          } else {
            responseData = (await promise) as R;
          }
          // Cache the new data if a cache key is provided
          if (cacheKey) {
            await setItemWithTTL(cacheKey, responseData, ttl);
          }
        }

        if (!isCancelled) {
          if (callback) callback(responseData);
          setData(responseData);
        }
      } catch (error) {
        const _error = error as E;
        setError(_error);
        if (onError) onError(_error);
        if (!isCancelled) {
          setData(undefined);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    if (refreshInterval) {
      timeIntervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      isCancelled = true;
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [cacheKey, refreshInterval, ttl, ...deps]);

  return [data, isLoading, error];
};

const setItemWithTTL = async <T>(key: string, value: T, ttl: number) => {
  const timestamp = Date.now();
  const item = { value, timestamp, ttl };
  await localForage.setItem(key, item);
};

// Function to get an item, checking its TTL
const getItemWithTTL = async <T>(key: string): Promise<T | undefined> => {
  const item = await localForage.getItem<{
    value: T;
    timestamp: number;
    ttl: number;
  }>(key);
  if (item && Date.now() - item.timestamp < item.ttl) {
    return item.value;
  } else if (item) {
    await localForage.removeItem(key);
  }
  return undefined;
};

const twoHours = 2 * 60 * 60 * 1000;
const sixHours = 6 * 60 * 60 * 1000;
const thirtySeconds = 1000 * 30;

const CLEANUP_INTERVAL = sixHours;

setInterval(() => {
  clearExpiredCache();
}, CLEANUP_INTERVAL);

const clearExpiredCache = async () => {
  const keys = await localForage.keys();
  const now = Date.now();

  keys.forEach(async (key) => {
    const item = await localForage.getItem<{
      value: any;
      timestamp: number;
      ttl: number;
    }>(key);
    if (item && now - item.timestamp >= item.ttl) {
      await localForage.removeItem(key);
      console.log(
        `Cache entry with key "${key}" has been removed due to expiration.`
      );
    }
  });
};
