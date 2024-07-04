"use client";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { Toaster } from "@repo/ui/components/ui/sonner";
import { AuthProvider } from "./AuthProvider";
import { UserProvider } from "./UserProvider";

export const AppContext = createContext<IAppContext>({
  openClientProfile: undefined,
  clientId: undefined,
});

interface IAppContext {}

export const AppProvider: React.FC<PropsWithChildren<IProps>> = (props) => {
  const [clientId, setClientId] = useState<string>();

  const value: IAppContext = useMemo(() => ({}), []);

  return (
    <AppContext.Provider value={value}>
      <AuthProvider>
        <UserProvider>{props.children}</UserProvider>
      </AuthProvider>
      <Toaster />
    </AppContext.Provider>
  );
};

interface IProps {
  // Add your prop types here
}
export const useAppContext = () => useContext(AppContext);
