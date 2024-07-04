"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ReactNode } from "react";
import { Input } from "../ui/input";
import { TimePicker } from "../TimePicker";

export const TimePickerField: React.FC<IProps> = (props) => {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {props.label && <FormLabel>{props.label}</FormLabel>}
          <TimePicker
            time={field.value}
            setTime={field.onChange}
            step={60}
            onChange={props.onChange}
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
  form: UseFormReturn;
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  onChange?: (event: any) => void;
}
