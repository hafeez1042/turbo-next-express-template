import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useId = () => {
  const [id, setId] = useState<string>("");
  useEffect(() => {
    setId(uuidv4());
  }, []);
  return id;
};