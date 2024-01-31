import ModuleBase from '..';

// Libraries
import AtomicAssets from '../assets';
import GraphQL from '../graphql';
import Utilities from '../utils';

// Helper functions
import { retryOperation } from '../warp';
import {
    buildAssetTags,
    buildCollectionTags,
    buildTradableAssetTags,
} from '../tags';

// GraphQL
import { GetCollectionQuery } from '../../../generated/graphql';
import { GetCollection } from '../graphql/collection';

// Types
import type { Tag } from 'arbundles';
import * as Types from '../../types';
import Transaction from 'arweave/node/lib/transaction';
import { UploadResponse } from '@irys/sdk/build/cjs/common/types';
import { TurboUploadDataItemResponse } from '@ardrive/turbo-sdk';

class Collection extends ModuleBase {
    protected assets: AtomicAssets;
    protected utils: Utilities;
    protected graphql: GraphQL;

    constructor(opts: Types.ModuleOpts) {
        super(opts);
        this.assets = new AtomicAssets(opts);
        this.utils = new Utilities(opts);
        this.graphql = new GraphQL(opts);
    }

    public async createCollectionWithAssetIds(
        opts: Types.CreateCollectionWithAssetIdsOpts,
    ): Promise<UploadResponse | Transaction | TurboUploadDataItemResponse> {
        const data = {
            type: 'Collection',
            items: opts.assetIds,
        };
        const baseTags: Tag[] = [];

        const tags = buildCollectionTags(baseTags, opts);
        const tx = this.utils.uploadData({
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

        const progressPerStep: number = 100 / (files.length + 4);

        const mutateAsync = async () => {
            try {
                const assetsSize = this.utils.getDirectorySize(opts.assets);
                const thumbnailSize = this.utils.getDirectorySize(
                    opts.thumbnail instanceof File
                        ? [opts.thumbnail]
                        : opts.thumbnail,
                );
                const bannerSize = this.utils.getDirectorySize(
                    opts.banner instanceof File ? [opts.banner] : opts.banner,
                );
                const totalSize = assetsSize + thumbnailSize + bannerSize;
                const cost = await this.utils.getUploadCost(totalSize);
                if (parseInt(cost.additional.atomic) > 0) {
                    throw new Error(
                        `Not enough balance to create ${
                            files.length + 1
                        } atomic assets`,
                    );
                }

                // Upload Thumbnail and Banner
                progress = 'uploading-thumbnail';
                callback({ step: progress, progress: 0 });
                const thumbTx = await this.utils.uploadData({
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
                const bannerTx = await this.utils.uploadData({
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

                    const tags = buildTradableAssetTags(
                        files[index]!,
                        tradableAssetOpts,
                    );
                    const tx = await this.utils.uploadData({
                        type: 'file',
                        data: files[index]!,
                        tags,
                    });
                    assetUploadPromises.push(tx.id);
                }

                const assetIds = await Promise.all(assetUploadPromises);

                // Register all atomic assets
                progress = 'registering-assets';
                callback({
                    step: progress,
                    progress: progressPerStep * (files.length + 2),
                });
                const assetRegistrationPromises = [];

                for (let index = 0; index < assetIds.length; index++) {
                    const assetId = assetIds[index]!;
                    const maxAttempts = 7;
                    const delayBetweenAttempts = 5000;

                    const node = this.irys
                        ? this.utils.getIrysNode()
                        : 'arweave';
                    const result = await retryOperation(
                        () => this.warp.register(assetId, node),
                        maxAttempts,
                        delayBetweenAttempts,
                    );
                    assetRegistrationPromises.push(result.contractTxId);
                }

                await Promise.all(assetRegistrationPromises);

                // Create Collection
                progress = 'creating-collection';
                callback({
                    step: progress,
                    progress: progressPerStep * (files.length + 3),
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

    public async getCollection(id: string) {
        try {
            const res = await this.graphql.gql
                .query<GetCollectionQuery>(GetCollection, {
                    collectionId: id,
                })
                .toPromise();

            if (!res?.data || !res?.data.transaction)
                throw new Error('No data');

            const data = (await fetch('https://arweave.net/' + id).then((res) =>
                res.json(),
            )) as { type: 'Collection'; items: string[] };

            return { ...res.data.transaction, data };
        } catch (error) {
            throw new Error(String(error));
        }
    }
}

export default Collection;
