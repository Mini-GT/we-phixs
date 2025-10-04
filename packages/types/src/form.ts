import { ChangeEvent } from "react";

type FormFieldProps = {
  label: string;
  value: string;
  required?: boolean;
  onChange?: (value: string) => void;
  onChangeEvent?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
  name?: string;
  labelStyle?: string;
  inputStyle?: string;
};

export type { FormFieldProps };
