import { Warp } from 'warp-contracts';
import Irys, { WebIrys } from '@irys/sdk';
import Arweave from 'arweave';

// Helpers
import { getConfig } from './lib/config';

// Types
import * as Types from './types';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { TurboAuthenticatedClientInterface } from '@ardrive/turbo-sdk';

class AtomicToolkitBase {
    protected warp: Warp;
    protected arweaveInstance: Arweave;
    protected irys: WebIrys | Irys | null | undefined;
    protected key: JWKInterface | 'use_wallet' | null;
    protected turbo: TurboAuthenticatedClientInterface | null | undefined;

    constructor(
        opts: Types.AtomicToolkitNodeOpts | Types.AtomicToolkitWebOpts,
    ) {
        const { warp, arweave, irys, key, turbo } = getConfig(opts);

        this.warp = warp;
        this.arweaveInstance = arweave;
        this.irys = irys;
        this.key = key;
        this.turbo = turbo;
    }
}

export default AtomicToolkitBase;
