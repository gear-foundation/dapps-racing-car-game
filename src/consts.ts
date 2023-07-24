import { HexString } from '@polkadot/util/types';

export const LOCAL_STORAGE = {
  ACCOUNT: 'account',
  WALLET: 'wallet',
  NODE: 'node',
  NODES: 'nodes',
  CONTRACT_ADDRESS: 'simple-nft-contract-address',
};

export const ADDRESS = {
  NODE: 'wss://testnet.vara.rs',
  NODES: 'https://idea.gear-tech.io/gear-nodes',
  CONTRACT: '0x16f0638014d8314cbdedefaaf5f4035fd0c1dbdd019286765f8ca988e28165d2' as HexString,
};

export const SEARCH_PARAMS = {
  MASTER_CONTRACT_ID: 'master',
};
