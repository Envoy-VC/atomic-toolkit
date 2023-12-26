// Helper functions
import { buildTradableAssetTags } from '../tags';
import { readState, retryOperation } from '../../lib/warp';

// GraphQL Queries
import { GetAtomicAsset } from '../graphql/assets';

// Types
import * as Types from '../../types';
import AtomicToolkitBase from '../../base';
import type { ContractDeploy } from 'warp-contracts';
import { GetAtomicAssetQuery } from '../../../generated/graphql';

class AtomicAssets extends AtomicToolkitBase {
    constructor(
        opts: Types.AtomicToolkitNodeOpts | Types.AtomicToolkitWebOpts,
    ) {
        super(opts);
    }

    public async createAtomicAsset(
        file: File,
        opts: Types.CreateTradableAssetOpts,
    ): Promise<ContractDeploy> {
        const tags = buildTradableAssetTags(file, opts);
        const maxAttempts = 7;
        const delayBetweenAttempts = 5000;

        const tx = await this.uploadData({
            type: 'file',
            data: file,
            tags,
        });

        const node = this.arweaveInstance ? 'arweave' : this.getIrysNode();
        const result = retryOperation(
            () => this.warp.register(tx.id, node),
            maxAttempts,
            delayBetweenAttempts,
        );

        return result;
    }

    public async getAtomicAsset(id: string) {
        try {
            const res = await this.gql
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
