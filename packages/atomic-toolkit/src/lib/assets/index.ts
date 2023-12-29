import ModuleBase from '..';

// Libraries
import GraphQL from '../graphql';
import Utilities from '../utils';

// Helper functions
import { buildTradableAssetTags } from '../tags';
import { readState, retryOperation } from '../../lib/warp';

// GraphQL Queries
import { GetAtomicAsset } from '../graphql/assets';

// Types
import * as Types from '../../types';

import type { ContractDeploy } from 'warp-contracts';
import type { GetAtomicAssetQuery } from '../../../generated/graphql';

class AtomicAssets extends ModuleBase {
    protected graphql: GraphQL;
    protected utils: Utilities;

    constructor(opts: Types.ModuleOpts) {
        super(opts);
        this.graphql = new GraphQL(opts);
        this.utils = new Utilities(opts);
    }

    public async createAtomicAsset(
        file: File | string,
        opts: Types.CreateTradableAssetOpts,
    ): Promise<ContractDeploy> {
        const tags = buildTradableAssetTags(file, opts);
        const maxAttempts = 7;
        const delayBetweenAttempts = 5000;

        const tx = await this.utils.uploadData({
            type: 'file',
            data: file,
            tags,
        });

        const node = this.irys ? this.utils.getIrysNode() : 'arweave';
        const result = retryOperation(
            () => this.warp.register(tx.id, node),
            maxAttempts,
            delayBetweenAttempts,
        );

        return result;
    }

    public async getAtomicAsset(id: string) {
        try {
            const res = await this.graphql.gql
                .query<GetAtomicAssetQuery>(GetAtomicAsset, {
                    transactionId: id,
                })
                .toPromise();

            if (!res?.data || !res?.data.transaction)
                throw new Error('No data');

            const data = res.data.transaction;

            const requiredTags = [
                {
                    name: 'App-Name',
                    value: 'SmartWeaveContract',
                },
            ];

            // throw error if required tags are missing
            if (
                !requiredTags.every((tag) =>
                    data.tags.some(
                        (t) => t.name === tag.name && t.value === tag.value,
                    ),
                )
            )
                throw new Error('Missing required Atomic Asset Tags');

            const state = await readState(id);

            return { ...data, state };
        } catch (error) {
            console.error(error);
            throw new Error(String(error));
        }
    }
}

export default AtomicAssets;
