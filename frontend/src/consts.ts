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
  CONTRACT: '0xfdc7889767225e9b9f5786c15d0aa4fc1eef036f9655fe994d3296d6b4e591dc' as HexString,
};

export const SEARCH_PARAMS = {
  MASTER_CONTRACT_ID: 'master',
};
