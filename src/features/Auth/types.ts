type SignInResponse = {
  accessToken: string;
  discord: string | null;
};

type ShareLinkResponse = {
  link: string;
  registeredUserCount: number;
  remainingUsersToInvite: number;
};

type LinkResponse = ShareLinkResponse & {
  expired?: boolean;
  freeze?: number;
  message?: string;
};

type AuthResponse = {
  email: string;
  id: string;
  publicKey: string;
  discord: string | null;
};

type AvailableTokensResponse = {
  result: number;
};

export type { SignInResponse, ShareLinkResponse, AuthResponse, AvailableTokensResponse, LinkResponse };
