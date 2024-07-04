import React, { useMemo } from "react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ClockIcon } from "@radix-ui/react-icons";

export const TimePicker: React.FC<IProps> = ({
  setTime,
  time,
  step = 60,
  onChange,
}) => {
  const timeOptions = useMemo(() => generateTimeOptions(step), [step]);

  return (
    <Select
      value={time}
      onValueChange={(value: string) => {
        if (onChange) onChange(value);
        setTime(value);
      }}
    >
      <SelectTrigger className="flex items-center">
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground">
            <ClockIcon />
          </span>
          <SelectValue placeholder={time} className="!pl-10" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {!timeOptions.includes(time) && (
          <SelectItem className="hidden" key={time} value={time}>
            {time}
          </SelectItem>
        )}
        {timeOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface IProps {
  time: string;
  setTime: (value: string) => void;
  step: number;
  onChange?: (value: string) => void;
}

const generateTimeOptions = (step: number): string[] => {
  const times: string[] = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += step) {
      const period = hour < 12 ? "AM" : "PM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayMinute = minute < 10 ? `0${minute}` : minute.toString();
      const formattedTime = `${displayHour}:${displayMinute} ${period}`;
      times.push(formattedTime);
    }
  }

  return times;
};
