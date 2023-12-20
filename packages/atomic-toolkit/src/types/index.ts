import Arweave from 'arweave';
import { Warp } from 'warp-contracts';
import Irys, { WebIrys } from '@irys/sdk';
import { JWKInterface } from 'arweave/node/lib/wallet';

export type AtomicToolkitWithArweave = {
    environment: 'mainnet' | 'testnet';
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp?: Warp;
    /**
     * Arweave Configuration Options(either arweave or irys)
     */
    useIrys?: false;
    /**
     * Arweave Configuration Options
     */
    arweave?: Arweave;
    jwk: JWKInterface;
};

export type AtomicToolkitWithIrys = {
    environment: 'mainnet' | 'testnet';
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp?: Warp;
    /**
     * Arweave Configuration Options(either arweave or irys)
     */
    useIrys: true;
    irys: Irys;
};

export type AtomicToolkitOpts =
    | AtomicToolkitWithArweave
    | AtomicToolkitWithIrys;

export type AtomicToolkitWebWithArweave = {
    environment: 'mainnet' | 'testnet';
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp?: Warp;
    /**
     * Wether to use Irys or not(false for Arweave Type)
     */
    useIrys?: false;
    /**
     * Arweave Configuration Options(either arweave or irys)
     */
    arweave?: Arweave;
    /**
     * Key File to use for Arweave
     *
     * @default 'use_wallet'
     */
    jwk?: JWKInterface | 'use_wallet';
};

export type AtomicToolkitWebWithIrys = {
    environment: 'mainnet' | 'testnet';
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp?: Warp;
    /**
     * Arweave Configuration Options(either arweave or irys)
     */
    useIrys: true;
    irys: WebIrys;
};

export type AtomicToolkitWebOpts =
    | AtomicToolkitWebWithArweave
    | AtomicToolkitWebWithIrys;

export * from './asset';
export * from './tags';
export * from './upload';
