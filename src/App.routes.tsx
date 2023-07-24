export const PLAY = 'play';
export const LEADERBOARD = 'leader-board';
export const START = 'start';
export const LOGIN = 'login';
export const NOT_AUTHORIZED = 'not-authorized';

export const routes: { [key: string]: { url: string } } = {
  Play: {
    url: `${PLAY}`,
  },
  Leaderboard: {
    url: `${LEADERBOARD}`,
  },
};
