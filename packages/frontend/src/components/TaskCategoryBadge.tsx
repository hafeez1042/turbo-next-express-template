import React from 'react';
import { Badge } from "./ui/badge";

export const TaskCategoryBadge: React.FC<ITaskCategoryBadgeProps> = (props) => {
  return (
    <Badge variant="outline">{props.category}</Badge>
  );
};

interface ITaskCategoryBadgeProps {
  category: string
}