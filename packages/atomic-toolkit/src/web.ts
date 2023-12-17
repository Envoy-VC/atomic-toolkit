import Arweave from 'arweave';
import { WebIrys } from '@irys/sdk';
import { ContractDeploy, Warp } from 'warp-contracts';

// Libraries
import { defaultArweave } from './lib/config';
import { uploadWithArweave, uploadWithIrys } from './lib/upload';
import { buildTradableAssetTags, buildCollectionTags } from './lib/tags';
import { retryOperation } from './lib/warp';

// Types
import * as Types from './types';
import { CreateTradableAssetOpts, CollectionOpts } from './types/asset';
import { UploadResponse } from '@irys/sdk/build/cjs/common/types';
import Transaction from 'arweave/node/lib/transaction';

class AtomicToolkitWeb {
    public warp: Warp;
    public useIrys: boolean;
    public arweave: Arweave | null;
    public irys: WebIrys | null;
    public jwk: string | null;

    constructor({
        warp,
        useIrys = false,
        ...props
    }: Types.AtomicToolkitWebOpts) {
        if (!warp.hasPlugin('deploy')) {
            throw new Error('Warp instance must have DeployPlugin');
        }

        this.warp = warp;
        this.useIrys = useIrys;

        if (useIrys) {
            this.irys = (props as { irys: WebIrys }).irys;
            this.arweave = null;
            this.jwk = null;
        } else {
            this.arweave =
                (props as { arweave?: Arweave }).arweave ?? defaultArweave;
            this.jwk = 'use_wallet';
            this.irys = null;
        }
    }

    public async createAtomicAsset(
        file: File,
        opts: CreateTradableAssetOpts,
    ): Promise<ContractDeploy | Transaction> {
        const tags = buildTradableAssetTags(file, opts);
        if (this.useIrys && this.irys) {
            const tx = await uploadWithIrys({
                irys: this.irys,
                type: 'file',
                data: file,
                tags,
            });
            const contract = this.warp.register(tx.id, this.getIrysNode());
            return contract;
        } else {
            if (!this.arweave || !this.jwk) {
                throw new Error('Arweave and JWK must be defined');
            }
            const tx = await uploadWithArweave({
                arweave: this.arweave,
                jwk: 'use_wallet',
                type: 'file',
                data: file,
                tags,
            });

            const maxAttempts = 5;
            const delayBetweenAttempts = 5000;

            const result = retryOperation(
                () => this.warp.register(tx.id, 'arweave'),
                maxAttempts,
                delayBetweenAttempts,
            );

            return result;
        }
    }

    public async createCollection(
        opts: CollectionOpts,
    ): Promise<UploadResponse | Transaction> {
        const data = {
            type: 'Collection',
            items: opts.assetIds,
        };
        const tags = buildCollectionTags(opts);
        if (this.useIrys && this.irys) {
            const tx = await uploadWithIrys({
                irys: this.irys,
                type: 'data',
                data: JSON.stringify(data),
                tags,
            });
            return tx;
        } else {
            if (!this.arweave || !this.jwk) {
                throw new Error('Arweave and JWK must be defined');
            }
            const tx = uploadWithArweave({
                arweave: this.arweave,
                jwk: 'use_wallet',
                type: 'data',
                data: JSON.stringify(data),
                tags,
            });
            return tx;
        }
    }

    protected getIrysNode() {
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

export default AtomicToolkitWeb;
