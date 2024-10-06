"use client";

import {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormReturn,
  UseFormStateReturn,
} from "react-hook-form";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "../../lib/utils";
import React, { ReactNode, useState } from "react";
import { Matcher } from "react-day-picker";
import { DatePicker } from "../DatePicker";

export const DatePickerField: React.FC<IProps> = (props) => {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={(renderProps) => <Render {...props} {...renderProps} />}
    />
  );
};

const Render: React.FC<
  {
    field: ControllerRenderProps<any, string>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<any>;
  } & IProps
> = ({ field, fieldState, formState, ...props }) => {
  return (
    <FormItem className={cn("flex flex-col w-full", fieldState.error && "hasError")}>
      {props.label && <FormLabel>{props.label}</FormLabel>}
      <div className="flex flex-col">
        <DatePicker
          date={field.value}
          setDate={(value: Date | undefined) => {
            field.onChange(value);
            if (props.onChange) props.onChange(value);
          }}
          fromDate={props.fromDate}
          disabled={props.disabled}
          fromYear={props.fromYear}
          toYear={props.toYear}
          toDate={props.toDate}
          calendarDisabled={props.calendarDisabled}
        />
        {props.description && (
          <FormDescription>{props.description}</FormDescription>
        )}
        <FormMessage />
      </div>
    </FormItem>
  );
};

interface IProps {
  form: UseFormReturn<any>;
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  calendarDisabled?: Matcher | Matcher[];
  disabled?: boolean;
  onChange?: (value?: Date) => void;
  fromYear?: number;
  toYear?: number;
  toDate?: Date;
  fromDate?: Date;
}
