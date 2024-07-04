import React, { PropsWithChildren } from "react";
import { Label } from "./ui/label";

export const FieldWrapper: React.FC<PropsWithChildren<IProps>> = (props) => {
  return (
    <label className={props.className}>
      {props.label && <Label className={props.errorMessage ? "text-destructive" : ""} >{props.label}</Label>}
      {props.children}
      {props.description && <p>{props.description}</p>}
      {props.errorMessage && <p className={props.errorMessage ? "text-destructive" : ""}>{props.errorMessage}</p>}
    </label>
  );
};

interface IProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  className?: string
}
