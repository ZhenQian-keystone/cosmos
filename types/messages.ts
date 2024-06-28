import {Asset} from '@xchainjs/xchain-util';
import {AccAddress} from 'cosmos-client';

export type MsgCoin = {
  asset: Asset;
  amount: string;
};

export class MsgNativeTx {
  coins: MsgCoin[];
  memo: string;
  signer: AccAddress;

  constructor(coins: MsgCoin[], memo: string, signer: AccAddress) {
    this.coins = coins;
    this.memo = memo;
    this.signer = signer;
  }
}
