import { IClient, ClientStatusEnum } from "@repo/types/lib/schema/client";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { useQuery } from "../../../hooks/useQuery";
import { projectServices } from "../../../services/projectServices";
import { useList } from "../../../hooks/useList";

export const ClientsContext = createContext<IClientsContext>({
  clients: undefined,
  setStatusFilter: undefined,
  statusFilter: undefined,
});

interface IClientsContext {
  clients: IClient[];
  setStatusFilter: React.Dispatch<React.SetStateAction<ClientStatusEnum>>;
  statusFilter: ClientStatusEnum;
}

export const ClientsProvider: React.FC<PropsWithChildren<IProps>> = (props) => {
  const [statusFilter, setStatusFilter] = useState<ClientStatusEnum>();
  const [clients, setClients, updateClient, deleteClient] = useList<IClient>();

  const [, isClientsFetching] = useQuery(projectServices.getAll, [], {
    defaultValue: [],
    callback: setClients,
  });

  const value: IClientsContext = useMemo(
    () => ({
      statusFilter,
      setStatusFilter,
      clients,
    }),
    [statusFilter, clients]
  );

  return (
    <ClientsContext.Provider value={value}>
      {props.children}
    </ClientsContext.Provider>
  );
};

interface IProps {
  // Add your prop types here
}
export const useClientsContext = () => useContext(ClientsContext);
