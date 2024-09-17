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
import { Matcher } from "react-day-picker";

export const DatePickerField: React.FC<IProps> = (props) => {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {props.label && <FormLabel>{props.label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Input
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  value={field.value && format(field.value, "PPP")}
                  placeholder={props.placeholder || "Pick a date"}
                >
                  {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                </Input>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(value) => {
                  if (props.onChange) props.onChange(value);
                  field.onChange(value);
                }}
                disabled={props.disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
  disabled?: Matcher | Matcher[];
  onChange?: (value?: Date) => void;
}
