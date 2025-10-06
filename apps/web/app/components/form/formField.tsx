import { FormFieldProps } from "@repo/types";
import type { ChangeEvent } from "react";

export function FormField({
  label,
  value = "",
  required = false,
  onChange,
  onChangeEvent,
  placeholder,
  type = "text",
  readOnly = false,
  name,
  labelStyle = "block text-sm font-medium mb-2 text-gray-700",
  inputStyle = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
}: FormFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChangeEvent) {
      onChangeEvent(e); // form-level handler (needs name)
    } else if (onChange) {
      onChange(e.target.value); // local handler (just value)
    }
  };

  return (
    <div>
      <label htmlFor={name} className={labelStyle}>
        {label}
      </label>
      <input
        autoComplete="off"
        id={name}
        type={type}
        value={value}
        required={required}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputStyle}
        readOnly={readOnly}
        name={name}
      />
    </div>
  );
}
