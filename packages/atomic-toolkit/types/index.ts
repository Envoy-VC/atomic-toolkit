import Arweave from 'arweave';
import { Warp } from 'warp-contracts';
import Irys, { WebIrys } from '@irys/sdk';
import { JWKInterface } from 'arweave/node/lib/wallet';

export type AtomicToolkitWithArweave = {
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp?: Warp;
    /**
     * Arweave Configuration Options
     */
    arweave?: Arweave;
    /**
     * Key File
     */
    jwk: JWKInterface;
};

export type AtomicToolkitWithIrys = {
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp?: Warp;
    /**
     * Irys Configuration Options
     */
    irys: Irys;
};

export type AtomicToolkitNodeOpts =
    | AtomicToolkitWithArweave
    | AtomicToolkitWithIrys;

export type AtomicToolkitWebWithArweave = {
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp?: Warp;
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
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp?: Warp;
    /**
     * Arweave Configuration Options(either arweave or irys)
     */
    irys: WebIrys;
};

export type AtomicToolkitWebOpts =
    | AtomicToolkitWebWithArweave
    | AtomicToolkitWebWithIrys;

export type ModuleOpts = {
    warp: Warp;
    arweave: Arweave | null;
    irys: WebIrys | Irys | null;
    jwk: JWKInterface | 'use_wallet' | null;
};

export * from './asset';
export * from './tags';
export * from './upload';
