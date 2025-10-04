type ApiError = {
  message: string;
  statusCode?: number;
  error?: string;
};

type ErrorContentProps = {
  details: ApiError["error"];
  message: ApiError["message"];
};

type FieldErrorTypes = {
  nameError: string;
  currentPasswordError: string;
  newPasswordError: string;
  confirmPasswordError: string;
};

export type { ApiError, ErrorContentProps, FieldErrorTypes };
