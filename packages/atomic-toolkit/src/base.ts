import { Warp } from 'warp-contracts';
import Irys from '@irys/sdk';
import Arweave from 'arweave';

// Warp
import { WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

// GraphQL
import { Client, cacheExchange, fetchExchange } from '@urql/core';

// Libraries
import { uploadWithArweave, uploadWithIrys } from './lib/upload';
import { defaultArweave } from './lib/config';

// Types
import * as Types from './types';
import { JWKInterface } from 'arweave/node/lib/wallet';
import Transaction from 'arweave/node/lib/transaction';
import { UploadResponse } from '@irys/sdk/build/cjs/common/types';

class AtomicToolkitBase {
    protected warp: Warp;
    protected arweaveInstance: Arweave;
    protected irys: Irys | null | undefined;
    protected key: JWKInterface | 'use_wallet' | null;
    protected urqlClient: Client;

    constructor(
        opts: Types.AtomicToolkitNodeOpts | Types.AtomicToolkitWebOpts,
    ) {
        const { warp, ...props } = opts;
        if (warp) {
            if (!warp.hasPlugin('deploy') || warp.environment === 'local') {
                throw new Error(
                    'Warp instance must have DeployPlugin and should not be on Local Environment',
                );
            }
            this.warp = warp;
        } else {
            this.warp = WarpFactory.forMainnet().use(new DeployPlugin());
        }

        if (typeof props === 'object' && 'irys' in props) {
            const { irys } = props as Types.AtomicToolkitWithIrys;
            this.irys = irys;
            this.arweaveInstance = defaultArweave;
            this.key = null;
        } else {
            const { arweave, key } = props as
                | Types.AtomicToolkitWithArweave
                | Types.AtomicToolkitWebWithArweave;
            this.arweaveInstance = arweave ?? defaultArweave;
            this.key = key ?? 'use_wallet';
            this.irys = null;
        }
        this.urqlClient = new Client({
            url: 'https://arweave.net/graphql',
            exchanges: [cacheExchange, fetchExchange],
        });
    }

    protected async uploadData(
        opts: Types.UploadDataOpts,
    ): Promise<Transaction | UploadResponse> {
        if (this.irys) {
            const tx = uploadWithIrys({
                irys: this.irys,
                type: opts.type,
                data: opts.data,
                tags: opts.tags,
            });
            return tx;
        } else {
            if (!this.arweaveInstance || !this.key) {
                throw new Error('Arweave and JWK must be defined');
            }
            const tx = uploadWithArweave({
                arweave: this.arweaveInstance,
                jwk: this.key,
                type: opts.type,
                data: opts.data,
                tags: opts.tags,
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

export default AtomicToolkitBase;
