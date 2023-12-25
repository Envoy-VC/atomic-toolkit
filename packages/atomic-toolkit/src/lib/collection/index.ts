// Helper functions
import {
    buildAssetTags,
    buildCollectionTags,
    buildTradableAssetTags,
} from '../tags';
import { ContractDeploy } from 'warp-contracts';
import { retryOperation } from '../warp';

// Types
import { Tag } from 'arbundles';
import * as Types from '../../types';
import Transaction from 'arweave/node/lib/transaction';
import { UploadResponse } from '@irys/sdk/build/cjs/common/types';
import AtomicToolkitBase from '../../base';

class Collection extends AtomicToolkitBase {
    constructor(
        opts: Types.AtomicToolkitNodeOpts | Types.AtomicToolkitWebOpts,
    ) {
        super(opts);
    }

    public async createCollectionWithAssetIds(
        opts: Types.CreateCollectionWithAssetIdsOpts,
    ): Promise<UploadResponse | Transaction> {
        const data = {
            type: 'Collection',
            items: opts.assetIds,
        };
        const baseTags: Tag[] = [];

        const tags = buildCollectionTags(baseTags, opts);
        const tx = this.uploadData({
            type: 'data',
            data: JSON.stringify(data),
            tags,
        });
        return tx;
    }

    public createCollection(
        callback: (progress: Types.CollectionProgress, error?: string) => void,
        opts: Types.CreateCollectionOpts,
    ) {
        let progress: string = 'idle';
        let error: Error | null = null;
        let files: File[] | string[] = [];
        if (typeof opts.assets === 'string') {
            const { readdirSync } = require('fs');
            const { join } = require('path');
            const paths: string[] = readdirSync(opts.assets).map(
                (file: string) => join(opts.assets, file),
            );
            if (paths.length === 0)
                throw new Error('No files found in the directory');
            files = paths;
        } else {
            files = opts.assets;
        }

        const progressPerStep: number = 100 / (files.length + 3);

        const mutateAsync = async () => {
            try {
                // Upload Thumbnail and Banner
                progress = 'uploading-thumbnail';
                callback({ step: progress, progress: 0 });
                const thumbTx = await this.uploadData({
                    type: 'file',
                    data: opts.thumbnail,
                    tags: buildAssetTags(opts.thumbnail, {
                        discoverability: {
                            type: 'image',
                            title: `${opts.collection.name} Thumbnail`,
                            description: opts.discoverability.description,
                        },
                        license: opts.license,
                    }),
                });
                progress = 'uploading-banner';
                callback({ step: progress, progress: progressPerStep });
                const bannerTx = await this.uploadData({
                    type: 'file',
                    data: opts.banner,
                    tags: buildAssetTags(opts.banner, {
                        discoverability: {
                            type: 'image',
                            title: `${opts.collection.name} Banner`,
                            description: opts.discoverability.description,
                        },
                        license: opts.license,
                    }),
                });

                // Upload All Atomic Assets
                let assetUploadPromises = [];

                for (let index = 0; index < files.length; index++) {
                    progress = `uploading-asset-${index}`;
                    callback({
                        step: progress,
                        progress: progressPerStep * (index + 2),
                    });
                    const tradableAssetOpts: Types.CreateTradableAssetOpts = {
                        initialState: {
                            name: `${opts.collection.name} #${index}`,
                            claimable: [],
                            ...opts.initState,
                        },
                        discoverability: {
                            type: 'image',
                            title: `${opts.collection.name} #${index}`,
                            description: opts.discoverability.description,
                        },
                        license: opts.license,
                        indexWithUCM: true,
                    };
                    const tx = await this.createAtomicAsset(
                        files[index]!,
                        tradableAssetOpts,
                    );
                    assetUploadPromises.push(tx.contractTxId);
                }

                const assetIds = await Promise.all(assetUploadPromises);

                // Create Collection
                progress = 'creating-collection';
                callback({
                    step: progress,
                    progress: progressPerStep * (files.length + 2),
                });
                const res = this.createCollectionWithAssetIds({
                    assetIds,
                    collection: {
                        ...opts.collection,
                        banner: bannerTx.id,
                        thumbnail: thumbTx.id,
                    },
                    discoverability: opts.discoverability,
                    stamp: opts.stamp,
                    additionalTags: opts.additionalTags,
                });
                progress = 'success';
                callback({
                    step: progress,
                    progress: 100,
                });
                progress = 'idle';
                return res;
            } catch (err) {
                error = new Error(String(err));
                callback(
                    {
                        step: progress,
                        progress: 0,
                    },
                    String(error),
                );
                throw error;
            }
        };

        return { mutateAsync };
    }

    protected async createAtomicAsset(
        file: File | string,
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

export default Collection;
