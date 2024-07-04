"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { IOption } from "@repo/types/lib/types";

export const Combobox: React.FC<IComboboxProps> = (props) => {
  const [selectedOptions, setSelectedOptions] = React.useState<IOption[]>(
    props.defaultSelectedOptions || []
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    props.onSelect(selectedOptions);
  }, [selectedOptions]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {selectedOptions.length > 0
            ? props.options
                .filter((option) =>
                  selectedOptions.some(
                    (selectedOption) => option.value === selectedOption.value
                  )
                )
                .map((option) => option.label)
                .join(", ")
            : props.placeholder || "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {props.options.map((option) => (
              <CommandItem
                key={option.value}
                value={`${option.value}`}
                onSelect={(currentValue) => {
                  setSelectedOptions((prevState) =>
                    prevState.some((option) => option.value === currentValue)
                      ? prevState.filter(
                          (option) => option.value !== currentValue
                        )
                      : [...prevState, option]
                  );
                  // setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedOptions.some(
                      (selectedOption) => selectedOption.value === option.value
                    )
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export interface IComboboxProps {
  options: IOption[];
  placeholder?: string;
  onSelect: (selectedOptions: IOption[]) => void;
  defaultSelectedOptions: IOption[];
}
