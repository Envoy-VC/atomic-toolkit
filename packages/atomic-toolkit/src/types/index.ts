import Arweave from 'arweave';
import { Warp } from 'warp-contracts';
import Irys, { WebIrys } from '@irys/sdk';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { TurboAuthenticatedClientInterface} from '@ardrive/turbo-sdk';



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

export type AtomicToolkitWithTurbo = {
    warp?: Warp;
    turbo?: TurboAuthenticatedClientInterface | null
};

export type AtomicToolkitNodeOpts = XOR<
    AtomicToolkitWithTurbo,
    XOR<AtomicToolkitWithIrys, AtomicToolkitWithArweave>
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

export type AtomicToolkitWebWithTurbo = {
    warp?: Warp;
    turbo?: TurboAuthenticatedClientInterface | null
}

export type AtomicToolkitWebOpts = XOR<
    AtomicToolkitWebWithArweave,
    XOR<AtomicToolkitWebWithIrys, AtomicToolkitWebWithTurbo>
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
    /**
     * Turbo Configuration Options
     */
    turbo: TurboAuthenticatedClientInterface | null;
};

export * from './asset';
export * from './tags';
export * from './upload';
export * from './collection';
