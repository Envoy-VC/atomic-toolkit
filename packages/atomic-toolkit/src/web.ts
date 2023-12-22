import Arweave from 'arweave';
import AtomicToolkitBase from './base';

import AtomicAssets from './lib/assets';
import Collection from './lib/collection';

// Types
import * as Types from './types';

class AtomicToolkitWeb extends AtomicToolkitBase {
    public assets: AtomicAssets;
    public collection: Collection;
    public arweave: Arweave;

    constructor(opts: Types.AtomicToolkitWebOpts) {
        super(opts);
        this.assets = new AtomicAssets(opts);
        this.collection = new Collection(opts);
        this.arweave = this.arweaveInstance;
    }
}

export default AtomicToolkitWeb;
