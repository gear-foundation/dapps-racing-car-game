import { HexString } from '@gear-js/api';
import { atom } from 'jotai';

export const ADDRESS = {
  SFT: process.env.REACT_APP_FT_ADDRESS as HexString,
};

export const IS_AVAILABLE_BALANCE_READY = atom<boolean>(false);
export const AVAILABLE_BALANCE = atom<undefined | { value: string; unit: string }>(undefined);
