import { ContractDeploy, Warp } from 'warp-contracts';
import Irys from '@irys/sdk';

// Helpers
import { buildTradableAssetTags, buildCollectionTags } from './helpers';

// Types
import {
    AtomicToolkitOpts,
    CreateTradableAssetOpts,
    CollectionOpts,
} from './types';
import { UploadResponse } from '@irys/sdk/build/cjs/common/types';

class AtomicToolkit {
    protected warp: Warp;
    protected irys: Irys;

    constructor({ warp, irys }: AtomicToolkitOpts) {
        if (!warp.hasPlugin('deploy')) {
            throw new Error('Warp instance must have DeployPlugin');
        }
        this.warp = warp;
        this.irys = irys;
    }

    /**
     * Creates an atomic asset by uploading a file and registering it as a contract.
     * @param file The file to be uploaded.
     * @param opts The options for creating the tradable asset.
     * @returns A promise that resolves to the deployed contract.
     */
    public async createAtomicAsset(
        pathToFile: string,
        opts: CreateTradableAssetOpts,
    ): Promise<ContractDeploy> {
        const tags = buildTradableAssetTags(pathToFile, opts);
        await this.irys.ready();
        const tx = await this.irys.uploadFile(pathToFile, {
            tags: tags,
        });
        const contract = this.warp.register(tx.id, this.getIrysNode());
        return contract;
    }

    /**
     * Creates a collection with the specified options.
     * @param opts - The options for creating the collection.
     * @returns A promise that resolves to the upload response.
     */
    public async createCollection(
        opts: CollectionOpts,
    ): Promise<UploadResponse> {
        const data = {
            type: 'Collection',
            items: opts.assetIds,
        };
        const tags = buildCollectionTags(opts);
        await this.irys.ready();
        const tx = this.irys.upload(JSON.stringify(data), {
            tags: tags,
        });

        return tx;
    }

    /**
     * Retrieves the Irys node from the API configuration URL.
     * 
     * @returns The Irys node as either 'node1' or 'node2'.
     * @throws Error if the node is 'devnet'.
     */
    public getIrysNode() {
        const url = this.irys.api.config.url.href;
        const node = url?.split('https://')[1]?.split('.irys.xyz')[0];
        if (node === 'devnet') {
            throw new Error('Only Node1 and Node2 are supported');
        }
        return node as 'node1' | 'node2';
    }
}

export default AtomicToolkit;
