import Arweave from 'arweave';
import { Warp } from 'warp-contracts';
import { JWKInterface } from 'arbundles';
import Irys, { WebIrys } from '@irys/sdk';

import * as Types from '../types';

class ModuleBase {
    protected warp: Warp;
    protected arweave: Arweave;
    protected irys: WebIrys | Irys | null;
    protected key: JWKInterface | 'use_wallet' | null;

    constructor(opts: Types.ModuleOpts) {
        this.warp = opts.warp;
        this.arweave = opts.arweave;
        this.irys = opts.irys;
        this.key = opts.key;
    }
}

export default ModuleBase;
