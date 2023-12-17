import { ContractDeploy, Warp } from 'warp-contracts';
import Irys from '@irys/sdk';
import Arweave from 'arweave';

// Libraries
import { defaultArweave } from './lib/config';
import { uploadWithArweave, uploadWithIrys } from './lib/upload';
import { buildTradableAssetTags, buildCollectionTags } from './lib/tags';

// Types
import * as Types from './types';
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

    constructor({ warp, useIrys = false, ...props }: Types.AtomicToolkitOpts) {
        if (!warp.hasPlugin('deploy')) {
            throw new Error('Warp instance must have DeployPlugin');
        }
        this.warp = warp;
        this.useIrys = useIrys;
        if (useIrys) {
            this.irys = (props as Types.AtomicToolkitWithIrys).irys;
            this.arweave = null;
            this.jwk = null;
        } else {
            this.arweave =
                (props as Types.AtomicToolkitWithArweave)?.arweave ??
                defaultArweave;
            this.jwk = (props as { jwk: JWKInterface }).jwk;
            this.irys = null;
        }
    }

    public async createAtomicAsset(
        pathToFile: string,
        opts: CreateTradableAssetOpts,
    ): Promise<ContractDeploy | Transaction> {
        const tags = buildTradableAssetTags(pathToFile, opts);
        if (this.useIrys && this.irys) {
            const tx = await uploadWithIrys({
                irys: this.irys,
                type: 'file',
                data: pathToFile,
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
                jwk: this.jwk,
                type: 'file',
                data: pathToFile,
                tags,
            });

            // TODO: Add Handling for users to register themselves
            await new Promise((resolve) => setTimeout(resolve, 15000));
            const contract = this.warp.register(tx.id, 'arweave');
            return contract;
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
                jwk: this.jwk,
                type: 'data',
                data: JSON.stringify(data),
                tags,
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
