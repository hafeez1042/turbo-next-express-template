"use client";
import { userServices } from "../services/userServices";
import { getAccessToken } from "../utils/accessToken";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { PropsWithChildren, useContext, useMemo, useState } from "react";
import { PageLoader } from "@repo/frontend/components/PageLoader";
import { useQuery } from "../hooks/useQuery";
import { ICurrentUser } from "../types";

export const userContext = React.createContext<IUserContext>({
  user: undefined,
});

interface IUserContext {
  user: ICurrentUser;
}

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const searchParam = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const [token, setToken] = useState(
    searchParam.get("token") || getAccessToken()
  );

  const [response, isFetchingUser] = useQuery(userServices.getCurrentUser, []);

  const user = response?.user;

  const value: IUserContext = useMemo(() => ({ user }), [user]);

  if (isFetchingUser) {
    return <PageLoader />;
  }

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export const useUser = () => {
  return useContext(userContext);
};
