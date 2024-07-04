import { DependencyList, useEffect, useState, useRef } from "react";
import localForage from 'localforage';

interface IProps<T> {
  callback?: DataMutator<T>;
  cacheKey?: string;
  refreshInterval?: number;
  ttl?: number;
}

type DataMutator<T> = (data: T) => void;

export const useQuery = <T = unknown>(
  promise: () => Promise<T>,
  deps: DependencyList,
  options?: IProps<T>,
): [T | undefined, boolean] => {
  const { callback, cacheKey, refreshInterval, ttl = 2 * 60 * 60 * 1000 } = options || {};
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | undefined>();
  const timeIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let responseData: T;
        // Attempt to retrieve cached data if a cache key is provided
        if (cacheKey) {
          responseData = await getItemWithTTL(cacheKey);
        }

        if (!responseData) {  // If there's no valid cached data, fetch new data
          responseData = await promise();
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
        console.error(error);
        if (!isCancelled) {
          setData(undefined);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
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
  }, [cacheKey, refreshInterval, ttl, ...(Array.isArray(deps) ? deps : [])]);

  return [data, isLoading];
};

const setItemWithTTL = async <T>(key: string, value: T, ttl: number) => {
  const timestamp = Date.now();
  const item = { value, timestamp, ttl };
  await localForage.setItem(key, item);
};

// Function to get an item, checking its TTL
const getItemWithTTL = async <T>(key: string): Promise<T | undefined> => {
  const item = await localForage.getItem<{ value: T, timestamp: number, ttl: number }>(key);
  if (item && (Date.now() - item.timestamp) < item.ttl) {
    return item.value;
  } else if (item) {
    await localForage.removeItem(key);
  }
  return undefined;
};

const CLEANUP_INTERVAL = 6 * 60 * 60 * 1000; // hours

setInterval(() => {
  clearExpiredCache();
}, CLEANUP_INTERVAL);

const clearExpiredCache = async () => {
  const keys = await localForage.keys();
  const now = Date.now();

  keys.forEach(async (key: string) => {
    const item = await localForage.getItem<{ value: any, timestamp: number, ttl: number }>(key);
    if (item && (now - item.timestamp) >= item.ttl) {
      await localForage.removeItem(key);
      console.log(`Cache entry with key "${key}" has been removed due to expiration.`);
    }
  });
};