"use client";
import { UseFormReturn, useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ReactNode } from "react";
import { Textarea } from "../ui/textarea";
import { cn } from "../../lib/utils";

export const TextAreaField: React.FC<IProps> = (props) => {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(fieldState.error ? "hasError" : "", props.className)}
        >
          {props.label && <FormLabel className="mb-4">{props.label}</FormLabel>}
          <FormControl>
            <Textarea
              placeholder={props.placeholder}
              {...field}
              className={`${fieldState.error ? "hasError" : ""}`}
              onChange={(e) => {
                if (
                  props.characterLimit &&
                  e.target.value.length > props.characterLimit
                ) {
                  return;
                }
                field.onChange(e);
              }}
            />
          </FormControl>
          <div className="flex justify-between relative">
            <FormDescription>{props.description}</FormDescription>

            <FormDescription>
              {props.characterLimit
                ? `${field.value?.length || 0}/${props.characterLimit}`
                : null}
            </FormDescription>
          </div>
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
  characterLimit?: number;
  className?: string;
}
