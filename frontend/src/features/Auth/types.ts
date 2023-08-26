type SignInResponse = {
  accessToken: string;
  username: string;
};

type AuthResponse = {
  email: string;
  id: string;
  publicKey: string;
  username: string;
};

export type { SignInResponse, AuthResponse };

export type ISignInError = {
  errors?: {
    message: string;
  };
  message?: string;
};
