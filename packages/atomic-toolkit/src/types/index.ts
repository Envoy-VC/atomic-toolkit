import Arweave from 'arweave';
import { Warp } from 'warp-contracts';
import Irys, { WebIrys } from '@irys/sdk';
import { JWKInterface } from 'arweave/node/lib/wallet';

export type AtomicToolkitWithArweave = {
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp: Warp;
    /**
     * Arweave Configuration Options(either arweave or irys)
     */
    useIrys?: false;
    arweave?: Arweave;
    jwk: JWKInterface;
};

export type AtomicToolkitWithIrys = {
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp: Warp;
    /**
     * Arweave Configuration Options(either arweave or irys)
     */
    useIrys: true;
    irys: Irys;
};

export type AtomicToolkitOpts =
    | AtomicToolkitWithArweave
    | AtomicToolkitWithIrys;

export type AtomicToolkitWebOpts =
    | {
          /**
           * A Warp instance that uses DeployPlugin
           */
          warp: Warp;
          /**
           * Arweave Configuration Options(either arweave or irys)
           */
          useIrys: false;
          arweave?: Arweave;
      }
    | {
          /**
           * A Warp instance that uses DeployPlugin
           */
          warp: Warp;
          /**
           * Arweave Configuration Options (either arweave or irys)
           */
          useIrys: true;
          irys: WebIrys;
      };
