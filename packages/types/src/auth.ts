interface loginFormType {
  email: string;
  password: string;
}

interface RegisterFormType extends loginFormType {
  name: string;
  confirmPassword: string;
}

export type {
  loginFormType,
  RegisterFormType
}