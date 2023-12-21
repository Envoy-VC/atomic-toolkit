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
import * as Types from '../../../types';
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

        if (opts.thumbnail) {
            const thumbnailTx = await this.uploadData({
                type: 'file',
                data: opts.thumbnail.file,
                tags: buildAssetTags(opts.thumbnail.file, opts.thumbnail.tags),
            });
            baseTags.push({
                name: 'Thumbnail',
                value: thumbnailTx.id,
            });
        }

        if (opts.banner) {
            const bannerTx = await this.uploadData({
                type: 'file',
                data: opts.banner.file,
                tags: buildAssetTags(opts.banner.file, opts.banner.tags),
            });
            baseTags.push({
                name: 'Banner',
                value: bannerTx.id,
            });
        }

        const tags = buildCollectionTags(baseTags, opts);
        const tx = this.uploadData({
            type: 'data',
            data: JSON.stringify(data),
            tags,
        });
        return tx;
    }

    public async createCollection(
        callback: (progress: string) => void,
        opts: Types.CreateCollectionOpts,
    ) {
        let progress: string = 'idle';
        let error: Error | null = null;

        const mutateAsync = async () => {
            try {
                // Upload Thumbnail and Banner
                progress = 'uploading-thumbnail';
                callback(progress);
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
                callback(progress);
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
                for (let index = 0; index < opts.assets.length; index++) {
                    progress = `uploading-asset-${index}`;
                    callback(progress);
                    const tradableAssetOpts: Types.CreateTradableAssetOpts = {
                        initialState: {
                            name: `${opts.collection.name} #${index}`,
                            ticker: opts.ticker,
                            balances: opts.balances,
                            claimable: [],
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
                        opts.assets[index]!,
                        tradableAssetOpts,
                    );
                    assetUploadPromises.push(tx.contractTxId);
                }

                const assetIds = await Promise.all(assetUploadPromises);

                // Create Collection
                progress = 'creating-collection';
                callback(progress);
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
                callback(progress);
                progress = 'idle';
                return res;
            } catch (err) {
                error = new Error(String(err));
                throw error;
            }
        };

        return { progress, mutateAsync };
    }

    protected async createAtomicAsset(
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

export default Collection;
