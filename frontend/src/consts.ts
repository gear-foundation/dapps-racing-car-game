import { HexString } from '@polkadot/util/types';

export const LOCAL_STORAGE = {
  ACCOUNT: 'account',
  WALLET: 'wallet',
  NODE: 'node',
  NODES: 'nodes',
  CONTRACT_ADDRESS: 'simple-nft-contract-address',
};

export const ADDRESS = {
  NODE: 'wss://vit.vara-network.io',
  NODES: 'https://idea.gear-tech.io/gear-nodes',
  CONTRACT: '0x15504d9ed20267e8a5c0f1711496aee7586fe8251c52c2b96d3e6b246120a9db' as HexString,
};

export const SEARCH_PARAMS = {
  MASTER_CONTRACT_ID: 'master',
};
