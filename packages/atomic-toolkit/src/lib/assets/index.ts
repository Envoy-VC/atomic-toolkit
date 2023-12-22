// Helper functions
import { retryOperation } from '../../lib/warp';
import { buildTradableAssetTags } from '../tags';

// Types
import * as Types from '../../types';
import type { ContractDeploy } from 'warp-contracts';
import Transaction from 'arweave/node/lib/transaction';
import AtomicToolkitBase from '../../base';
import Arweave from 'arweave';

class AtomicAssets extends AtomicToolkitBase {
    constructor(
        opts: Types.AtomicToolkitNodeOpts | Types.AtomicToolkitWebOpts,
    ) {
        super(opts);
    }

    public async createAtomicAsset(
        file: File,
        opts: Types.CreateTradableAssetOpts,
    ): Promise<ContractDeploy | Transaction> {
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
}

export default AtomicAssets;
