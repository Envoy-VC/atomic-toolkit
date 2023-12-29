import AtomicToolkitBase from './base';

// Libraries
import AtomicAssets from './lib/assets';
import Collection from './lib/collection';
import Utilities from './lib/utils';
import GraphQL from './lib/graphql';

// Helper functions
import { getConfig } from './lib/config';

// Types
import * as Types from './types';

class AtomicToolkit extends AtomicToolkitBase {
    public assets: AtomicAssets;
    public collection: Collection;
    public utils: Utilities;
    public gql: GraphQL['gql'];

    constructor(opts: Types.AtomicToolkitNodeOpts) {
        super(opts);
        const moduleOpts = getConfig(opts);
        this.assets = new AtomicAssets(moduleOpts);
        this.collection = new Collection(moduleOpts);
        this.utils = new Utilities(moduleOpts);
        this.gql = new GraphQL(moduleOpts).gql;
    }
}

export default AtomicToolkit;
