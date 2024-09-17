"use client";

import { UseFormReturn } from "react-hook-form";
import { IOption } from "@repo/types/lib/types";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ReactNode } from "react";

export const SelectField: React.FC<IProps> = (props) => {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={props.className || ""}>
          {props.label && <FormLabel>{props.label}</FormLabel>}
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem value={`${option.value}`} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {props.description && (
            <FormDescription>{props.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface IProps {
  form: UseFormReturn<any>;
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  options: IOption[];
  className?: string;
}
