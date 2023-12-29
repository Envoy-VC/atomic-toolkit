import ModuleBase from '..';
import * as Types from '../../types';

import { Client } from '@urql/core';
import { cacheExchange, fetchExchange } from '@urql/core';

class GraphQL extends ModuleBase {
    public gql: Client;
    constructor(opts: Types.ModuleOpts) {
        super(opts);
        this.gql = new Client({
            url: 'https://arweave.net/graphql',
            exchanges: [cacheExchange, fetchExchange],
            maskTypename: true,
        });
    }
}

export default GraphQL;
