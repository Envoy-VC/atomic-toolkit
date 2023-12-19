import { ContractDeploy, Warp } from 'warp-contracts';
import Irys from '@irys/sdk';
import Arweave from 'arweave';

import { WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

// Libraries
import { retryOperation } from './lib/warp';
import { defaultArweave } from './lib/config';
import { uploadWithArweave, uploadWithIrys } from './lib/upload';
import {
    buildTradableAssetTags,
    buildCollectionTags,
    buildAssetTags,
} from './lib/tags';

// Types
import * as Types from './types';
import { Tag } from 'arbundles';
import { CreateTradableAssetOpts, CollectionOpts } from './types/asset';
import { UploadResponse } from '@irys/sdk/build/cjs/common/types';
import { JWKInterface } from 'arweave/node/lib/wallet';
import Transaction from 'arweave/node/lib/transaction';

class AtomicToolkit {
    public warp: Warp;
    public useIrys: boolean;
    public arweave: Arweave | null;
    public irys: Irys | null;
    protected jwk: JWKInterface | null;

    constructor({
        environment,
        warp,
        useIrys = false,
        ...props
    }: Types.AtomicToolkitOpts) {
        if (warp) {
            if (!warp.hasPlugin('deploy') || warp.environment === 'local') {
                throw new Error(
                    'Warp instance must have DeployPlugin and should not be on Local Environment',
                );
            }
            this.warp = warp;
        } else {
            if (environment === 'mainnet') {
                this.warp = WarpFactory.forMainnet().use(new DeployPlugin());
            } else {
                this.warp = WarpFactory.forTestnet().use(new DeployPlugin());
            }
        }

        this.useIrys = useIrys;

        if (useIrys) {
            const { irys } = props as Types.AtomicToolkitWithIrys;
            this.irys = irys;
            this.arweave = null;
            this.jwk = null;
        } else {
            const { arweave, jwk } = props as Types.AtomicToolkitWebWithArweave;
            if (jwk === 'use_wallet') {
                throw new Error(
                    'JWK must be of type JWKInterface when using Irys, use AtomicToolkitWeb "use_wallet" to use the current wallet',
                );
            }
            this.arweave = arweave ?? defaultArweave;
            this.jwk = jwk ?? null;
            this.irys = null;
        }
    }

    public async createAtomicAsset(
        pathToFile: string,
        opts: CreateTradableAssetOpts,
    ): Promise<ContractDeploy | Transaction> {
        const tags = buildTradableAssetTags(pathToFile, opts);

        const maxAttempts = 5;
        const delayBetweenAttempts = 5000;

        const tx = await this.uploadData({
            type: 'file',
            data: pathToFile,
            tags,
        });

        const result = retryOperation(
            () => this.warp.register(tx.id, this.getIrysNode()),
            maxAttempts,
            delayBetweenAttempts,
        );

        return result;
    }

    public async createCollection(
        opts: CollectionOpts,
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

    protected async uploadData(
        opts: Types.UploadDataOpts,
    ): Promise<Transaction | UploadResponse> {
        if (this.useIrys && this.irys) {
            if (opts.data instanceof File) {
                throw new Error(
                    'String data not supported in NodeIrys, provide File path instead.',
                );
            }
            const tx = uploadWithIrys({
                irys: this.irys,
                data: opts.data,
                type: opts.type,
                tags: opts.tags,
            });
            return tx;
        } else {
            if (!this.arweave || !this.jwk) {
                throw new Error('Arweave and JWK must be defined');
            }
            const tx = uploadWithArweave({
                arweave: this.arweave,
                jwk: this.jwk,
                type: opts.type,
                data: opts.data,
                tags: opts.tags,
            });
            return tx;
        }
    }

    public getIrysNode() {
        if (!this.irys) {
            throw new Error('Irys is not defined');
        }
        const url = this.irys.api.config.url.href;
        const node = url?.split('https://')[1]?.split('.irys.xyz')[0];
        if (node === 'devnet') {
            throw new Error('Only Node1 and Node2 are supported');
        }
        return node as 'node1' | 'node2';
    }
}

export default AtomicToolkit;
