"use client";
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@repo/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/frontend/components/ui/tabs";
import { ClientsTable } from "./components/ClientsTable";
import { ClientFormModal } from "./components/ClientFormModal";
import { ClientsProvider } from "./ClientsProvider";

export const description =
  "An projects dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of projects in a table with actions.";

export const ProjectsPageContent: React.FC = () => {
  return (
    <ClientsProvider>
      <main className="grid flex-1 items-start gap-4 p-4 md:p-10 sm:px-6 md:gap-8">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabItems />
            <AddButton />
          </div>
          <Content />
        </Tabs>
      </main>
    </ClientsProvider>
  );
};

const TabItems = () => {
  return (
    <TabsList>
      <TabsTrigger value="all">All</TabsTrigger>
      <TabsTrigger value="active">Active</TabsTrigger>
      <TabsTrigger value="draft">Draft</TabsTrigger>
      <TabsTrigger value="archived" className="hidden sm:flex">
        Archived
      </TabsTrigger>
    </TabsList>
  );
};

const Content: React.FC = () => {
  return (
    <TabsContent value="all">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <CardDescription>
            Manage your clients and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientsTable />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

const AddButton: React.FC = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" className="h-7 gap-1" onClick={() => setOpen(true)}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Client
          </span>
        </Button>
      </div>
      <ClientFormModal onClose={() => setOpen(false)} isOpen={isOpen} />
    </>
  );
};
