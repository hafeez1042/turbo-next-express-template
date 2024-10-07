import React from "react";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@repo/frontend/components/ui/badge";
import { Button } from "@repo/frontend/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/frontend/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/frontend/components/ui/table";
import Link from "next/link";
import { useClientsContext } from "../ClientsProvider";

export const ClientsTable: React.FC<IProps> = (props) => {
  const { clients } = useClientsContext();
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead className="hidden md:table-cell">Start Date</TableHead>
            <TableHead className="hidden md:table-cell">End Date</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                <Link href={`/clients/${client.id}`}>{client.name}</Link>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{client.status}</Badge>
              </TableCell>
              <TableCell>{client.manager_id}</TableCell>
              <TableCell className="hidden md:table-cell">
                {client.start_date?.toLocaleDateString()}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {client.end_date.toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="text-xs text-muted-foreground">
        Showing <strong>1-10</strong> of <strong>32</strong> clients
      </div>
    </div>
  );
};

interface IProps {}
