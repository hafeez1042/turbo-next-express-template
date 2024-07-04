"use client";

import { UseFormReturn } from "react-hook-form";
import { IOption } from "@repo/types/lib/types";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ReactNode } from "react";
import { Combobox } from "../Combobox";

export const ComboboxField: React.FC<IProps> = (props) => {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={props.className || ""}>
          {props.label && <FormLabel>{props.label}</FormLabel>}
          <Combobox
            options={props.options}
            defaultSelectedOptions={field.value}
            onSelect={field.onChange}
          />
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
