"use client"
import React, { useState } from "react";
import { File, PlusCircle } from "lucide-react";

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
import { TaskFormModal } from "./components/TaskFormModal";
import { TasksTable } from "./components/TasksTable";

export const description =
  "An tasks dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of tasks in a table with actions.";

export const TasksPageContent: React.FC = () => {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 md:p-10 sm:px-6 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabItems />
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <AddButton />
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                Manage your tasks and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TasksTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

const TabItems: React.FC = () => {
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

const AddButton: React.FC = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" className="h-7 gap-1" onClick={() => setOpen(true)}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Task
          </span>
        </Button>
      </div>
      <TaskFormModal onClose={() => setOpen(false)} isOpen={isOpen} />
    </>
  );
};
