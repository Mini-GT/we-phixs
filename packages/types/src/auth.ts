interface loginFormType {
  email: string;
  password: string;
}

interface RegisterFormType extends loginFormType {
  name: string;
  confirmPassword: string;
}

type DiscordOauth = {
  code: string | null;
};

export type { loginFormType, RegisterFormType, DiscordOauth };
