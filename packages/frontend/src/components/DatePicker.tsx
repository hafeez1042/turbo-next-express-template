import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { getDate } from "../lib/getDate";
import { Calendar as CalendarIcon } from "lucide-react";
import ReactInputMask from "react-input-mask";
import { Input } from "./ui/input";
import { format, isValid, parse } from "date-fns";
import { Matcher } from "react-day-picker";

export const DatePicker: React.FC<IDatePickerProps> = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [month, setMonth] = useState<Date>();

  useEffect(() => {
    if (isValid(props.date)) {
      setMonth(props.date);
      setInputValue(getDate(props.date));
    }
  }, [props.date]);

  const handleDayPickerSelect = (date: Date | undefined) => {
    if (!date) {
      setInputValue("");
      props.setDate(undefined);
    } else {
      props.setDate(date);
      setMonth(date);
      setInputValue(format(date, "MM/dd/yyyy"));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // keep the input props.date in sync

    const parsedDate = parse(e.target.value, "MM/dd/yyyy", new Date());

    if (isValid(parsedDate)) {
      props.setDate(parsedDate);
      setMonth(parsedDate);
    } else {
      props.setDate(undefined);
    }
  };

  return (
    <Popover>
      <div className="relative">
        <ReactInputMask
          mask="99/99/9999"
          alwaysShowMask
          value={inputValue}
          onChange={handleInputChange}
          disabled={props.disabled}
        >
          {
            ((inputProps: any) => (
              <div>
                <Input
                  {...inputProps}
                  placeholder={"Pick a date"}
                  disabled={props.disabled}
                />
              </div>
            )) as unknown as React.ReactNode
          }
        </ReactInputMask>
        <PopoverTrigger
          className="absolute right-0 top-0 !w-auto"
          asChild
          disabled={props.disabled}
        >
          <Button
            variant={"icon"}
            className={cn(
              "w-full justify-between text-left font-normal rounded-xl",
              !props.date && "text-muted-foreground"
            )}
          >
            <i className="text-neutral-500">
              <CalendarIcon size={20} />
            </i>
          </Button>
        </PopoverTrigger>
      </div>

      <PopoverContent className="w-auto p-0" align="start" portal={false}>
        <Calendar
          mode="single"
          selected={
            props.date &&
            (props.fromDate! > props.date || props.toDate! < props.date)
              ? undefined
              : props.date
          }
          onSelect={handleDayPickerSelect}
          disabled={props.calendarDisabled}
          initialFocus
          fromYear={props.fromYear}
          toYear={props.toYear}
          toDate={props.toDate}
          fromDate={props.fromDate}
          showOutsideDays={false}
          month={month}
          onMonthChange={setMonth}
        />
      </PopoverContent>
    </Popover>
  );
};

interface IDatePickerProps {
  setDate: (date?: Date) => void;
  date: Date;
  fromDate?: Date;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
  toDate?: Date;
  calendarDisabled?: Matcher | Matcher[];
}
