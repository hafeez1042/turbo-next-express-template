import { useEffect, useRef } from "react";

export const useInitialRender = () => {
  const initialRenderRef = useRef<boolean>(true);

  useEffect(() => {
    initialRenderRef.current = false;
  }, []);

  return initialRenderRef.current;
};
