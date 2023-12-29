import Arweave from 'arweave';
import AtomicToolkitBase from './base';

import AtomicAssets from './lib/assets';
import Collection from './lib/collection';
import Utilities from './lib/utils';

// Types
import * as Types from './types';

class AtomicToolkit extends AtomicToolkitBase {
    public assets: AtomicAssets;
    public collection: Collection;
    public utils: Utilities;

    constructor(opts: Types.AtomicToolkitNodeOpts) {
        super(opts);
        this.assets = new AtomicAssets(opts);
        this.collection = new Collection(opts);
        this.utils = new Utilities(opts);
    }
}

export default AtomicToolkit;
