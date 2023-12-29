import Arweave from 'arweave';
import { Warp } from 'warp-contracts';
import Irys, { WebIrys } from '@irys/sdk';
import { JWKInterface } from 'arweave/node/lib/wallet';

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;

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
    key: JWKInterface;
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

export type AtomicToolkitNodeOpts = XOR<
    AtomicToolkitWithArweave,
    AtomicToolkitWithIrys
>;

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
    key?: JWKInterface | 'use_wallet';
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

export type AtomicToolkitWebOpts = XOR<
    AtomicToolkitWebWithArweave,
    AtomicToolkitWebWithIrys
>;

export type ModuleOpts = {
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp: Warp;
    /**
     * Arweave Configuration Options(either arweave or irys)
     */
    arweave: Arweave;
    /**
     * Key File to use for Arweave
     *
     * @default 'use_wallet'
     */
    key: JWKInterface | 'use_wallet' | null;
    /**
     * Irys Configuration Options
     */
    irys: WebIrys | Irys | null;
};

export * from './asset';
export * from './tags';
export * from './upload';
export * from './collection';
