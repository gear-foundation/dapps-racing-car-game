import { useSendMessage } from '@gear-js/react-hooks';
import { ADDRESS } from '@/consts';
import { useProgramMetadata, useProgramState } from '@/hooks';
import metaTxt from '@/assets/meta/meta.txt';
import { Config, GameState } from '@/types';

function usePlayerMoveMessage() {
  const meta = useProgramMetadata(metaTxt);

  return useSendMessage(ADDRESS.CONTRACT, meta, {
    isMaxGasLimit: true,
    disableAlerts: true,
  });
}

function useStartGameMessage() {
  const meta = useProgramMetadata(metaTxt);

  const message = useSendMessage(ADDRESS.CONTRACT, meta, {
    isMaxGasLimit: true,
  });

  return { meta, message };
}

function useGameState() {
  const data = useProgramState<GameState>('game');

  if (data?.state && Object.keys(data.state)[0] === 'Game') {
    return { ...data, state: { Game: null } };
  }

  return { ...data, state: { Game: data.state } };
}

function useConfigState() {
  const data = useProgramState<Config>('config');

  return { ...data, state: { Config: data.state } };
}

export { usePlayerMoveMessage, useStartGameMessage, useGameState, useConfigState };
