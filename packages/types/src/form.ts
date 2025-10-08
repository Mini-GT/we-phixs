import { ChangeEvent } from "react";

type FormFieldProps = {
  label: string;
  value: string | undefined;
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

type CreateCanvasFormPath = "name" | "gridSize";

export type { FormFieldProps, CreateCanvasFormPath };
