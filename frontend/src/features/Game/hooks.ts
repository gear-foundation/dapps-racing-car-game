import { useMemo } from 'react';
import { useSendMessage } from '@gear-js/react-hooks';
import { ADDRESS } from '@/consts';
import { useProgramMetadata, useProgramState } from '@/hooks';
import metaTxt from '@/assets/meta/meta.txt';
import { AllGames, Config, Game, StrategyIds } from '@/types';

function usePlayerMoveMessage() {
  const meta = useProgramMetadata(metaTxt);

  return useSendMessage(ADDRESS.CONTRACT, meta, {
    isMaxGasLimit: true,
  });
}

function useStartGameMessage() {
  const meta = useProgramMetadata(metaTxt);

  const message = useSendMessage(ADDRESS.CONTRACT, meta);

  return { meta, message };
}

function useGameState(address?: string) {
  const payload = useMemo(
    () => ({
      Game: { account_id: address },
    }),
    [address],
  );

  return useProgramState<Game>(payload);
}

function useConfigState() {
  const payload = useMemo(() => ({ Config: null }), []);

  return useProgramState<Config>(payload);
}

function useStrategyIdsState() {
  const payload = useMemo(() => ({ StrategyIds: null }), []);

  return useProgramState<StrategyIds>(payload);
}

export function useAllGamesState() {
  const payload = useMemo(() => ({ AllGames: null }), []);

  return useProgramState<AllGames>(payload);
}

export { usePlayerMoveMessage, useStartGameMessage, useGameState, useConfigState, useStrategyIdsState };
