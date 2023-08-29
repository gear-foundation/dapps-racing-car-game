import { HexString } from '@polkadot/util/types';

export type IFTMain = {
  admins: HexString[];
  allowances: HexString[];
  balances: Array<[HexString, string]>;
  decimals: string;
  name: string;
  symbol: string;
  totalSupply: string;
};

export type IFTLogic = {
  admin: HexString;
  ftokenId: HexString;
  idToStorage: Array<[string, HexString]>;
  instructions: [];
  storageCodeHash: HexString;
  transactionStatus: [HexString, 'Failure' | 'Success'][];
};

export type IFTStorage = {
  approvals: [];
  balances: Array<[HexString, string]>;
  ftLogicId: HexString;
  transactionStatus: [];
};

export type SystemAccount = {
  consumers: number; // 0
  data: {
    feeFrozen: number | HexString; // 0
    free: number | HexString; // '0x...'
    miscFrozen: number | HexString; // 0
    reserved: number | HexString; //  8327965542000
  };
  nonce: number; // 94
  providers: number; // 1
  sufficients: number; // 0
};
