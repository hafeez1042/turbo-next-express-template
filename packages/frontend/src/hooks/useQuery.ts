import {
  DependencyList,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import * as localForage from "localforage";
interface IOptions<
  T,
  R = T,
  P extends unknown[] = unknown[],
  E extends Error = Error,
> {
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
  params?: P;
}

type DataMutator<T> = (data: T) => void;

export const useQuery = <
  T,
  R = T,
  P extends unknown[] = [],
  E extends Error = Error,
>(
  promiseFunction: ((...args: P) => Promise<T>) | (() => Promise<T>),
  deps: DependencyList,
  options?: IOptions<T, R, P>
): [R | undefined, boolean, E, (silent?: boolean) => Promise<void>] => {
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
    params,
  } = options || {};
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<R | undefined>(defaultValue);
  const [error, setError] = useState<E>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeIntervalRef = useRef<any>(null);

  // Track if the component is mounted
  const isMounted = useRef(true);

  // Define fetchData outside useEffect for reusability
  const fetchData = async (skipCache?: boolean, silent?: boolean) => {
    if (!condition || !isMounted.current) {
      setIsLoading(false);
      setData(defaultValue);
      return;
    }
    setIsLoading(silent ? false : true);
    try {
      let responseData: R | undefined;
      // Attempt to retrieve cached data if a cache key is provided and skipCache is not true
      if (cacheKey && !skipCache) {
        responseData = await getItemWithTTL(cacheKey);
      }
      if (!responseData) {
        // If there's no valid cached data, fetch new data
        const promise = params ? promiseFunction(...params) : promiseFunction();

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

      if (isMounted.current) {
        if (callback) callback(responseData);
        setData(responseData);
      }
    } catch (error) {
      const _error = error as E;
      setError(_error);
      if (onError) onError(_error);
      if (isMounted.current) {
        setData(undefined);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (prevDeps.current !== deps && resetOnDepChange) {
      if (callback) callback(undefined);
      setData(undefined);
    }
    prevDeps.current = deps;

    // Set component as mounted
    isMounted.current = true;

    // Initial data fetch
    fetchData().catch(console.error);

    if (refreshInterval) {
      timeIntervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      // Set component as unmounted
      isMounted.current = false;
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [cacheKey, refreshInterval, ttl, ...deps]);

  // Memoize the refetch function to prevent unnecessary re-renders when passing it as a prop
  const refetch = useCallback(
    async (silent?: boolean) => {
      await fetchData(true, silent);
    },
    [fetchData]
  );

  return [data, isLoading, error, refetch];
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

const sixHours = 6 * 60 * 60 * 1000;
const thirtySeconds = 1000 * 30;

const CLEANUP_INTERVAL = sixHours;

setInterval(async () => {
  await clearExpiredCache();
}, CLEANUP_INTERVAL);

const clearExpiredCache = async () => {
  const keys = await localForage.keys();
  const now = Date.now();

  keys.forEach(async (key: string) => {
    const item = await localForage.getItem<{
      value: unknown;
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
