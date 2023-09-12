import { atom } from 'jotai';
import { ADDRESS } from '@/consts';
import { ConfigState, CurrentGameState, ICustomNode, MsgIdToGameIdState } from './types';

export const CONTRACT_ADDRESS_ATOM = atom(ADDRESS.CONTRACT);

export const STRATEGY_IDS = atom<string[] | null>(null);

export const CURRENT_GAME = atom<CurrentGameState | null>(null);

export const MSG_TO_GAME_ID = atom<MsgIdToGameIdState | null>(null);

export const CONFIG = atom<ConfigState | null>(null);

export const nodesAtom = atom<ICustomNode[] | undefined>(undefined);
