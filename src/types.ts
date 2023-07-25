import { HexString } from '@polkadot/util/types';

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type Handler = (event: Event) => void;

export interface GamesState {
  [key: string]: GameState;
}

export interface Car {
  balance: string;
  penalty: string;
  position: string;
  speed: string;
  roundResult: Record<string, string> | null;
}

export interface Cars {
  [key: string]: Car;
}

export interface GameState {
  cars: Cars;
  carIds: string[];
  currentTurn: string;
  state: 'PlayerAction' | 'Finished';
  result: 'Win' | 'Draw' | 'Lose';
  currentRound: string;
}

export type CurrentGameState = GameState;

export interface MsgIdToGameIdState {}

export interface ConfigState {
  leaderboardContract: any;
  ftContract: any;
  nftMembershipGuard: any;
  tokensOnWin: string;
  tokensOnDraw: string;
  tokensOnLose: string;
}

export interface ProgramState {
  admin: HexString;
  strategyIds: string[];
  games: GamesState;
  msgIdToGameId: MsgIdToGameIdState;
  config: ConfigState;
}

export interface ProgramStateRes {
  state?: ProgramState;
  isStateRead: Boolean;
  error: string;
}
