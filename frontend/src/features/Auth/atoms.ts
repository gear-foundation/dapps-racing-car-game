import { atom } from 'jotai';
import { AUTH_TOKEN_LOCAL_STORAGE_KEY } from './consts';

export const AUTH_TOKEN_ATOM = atom<string | null>(localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE_KEY));

export const TESTNET_USERNAME_ATOM = atom('');

export const IS_AUTH_READY_ATOM = atom(false);
