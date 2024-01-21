import ModuleBase from '..';
import BigNumber from 'bignumber.js';

// Helpers
import { uploadWithIrys, uploadWithArweave, uploadWithTurbo } from '../upload';

// Types
import * as Types from '../../types';
import { UploadResponse } from '@irys/sdk/build/cjs/common/types';
import Transaction from 'arweave/node/lib/transaction';
import { TurboUploadDataItemResponse } from '@ardrive/turbo-sdk';

class Utilities extends ModuleBase {
    constructor(opts: Types.ModuleOpts) {
        super(opts);
    }

    public getDirectorySize(files: string | File[]) {
        let totalSize = 0;

        function calculateSize(filePath: string) {
            const fs = require('fs');
            const path = require('path');
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
                totalSize += stats.size;
            } else if (stats.isDirectory()) {
                const files = fs.readdirSync(filePath);
                files.forEach((file: string) => {
                    calculateSize(path.join(filePath, file));
                });
            }
        }
        if (typeof files === 'string') {
            calculateSize(files);
        } else {
            files.forEach((file) => {
                totalSize += file.size;
            });
        }

        return totalSize;
    }

    public async getUploadCost(size: number) {
        let token: string;
        let balance: { atomic: string; formatted: string };
        let cost: { atomic: string; formatted: string };
        let additional: { atomic: string; formatted: string };

        if (this.irys) {
            await this.irys.ready();
            const b = await this.irys.getLoadedBalance();
            const c = await this.irys.getPrice(size);
            const a = c.minus(b);

            token = this.irys.utils.token;
            balance = {
                atomic: b.toString(),
                formatted: this.irys.utils.fromAtomic(b).toString(),
            };
            cost = {
                atomic: c.toString(),
                formatted: this.irys.utils.fromAtomic(c).toString(),
            };
            additional = {
                atomic: a.isGreaterThan(0) ? a.toString() : '0',
                formatted: a.isGreaterThan(0)
                    ? this.irys.utils.fromAtomic(a).toString()
                    : '0',
            };
        } else if (this.turbo) {
            const b1 = await this.turbo.getBalance();
            const b = Number(b1['winc']);

            // Ensure c1 and c1[0] are defined before accessing 'winc'
            const c1 = await this.turbo.getUploadCosts({ bytes: [size] });
            if (!c1 || !c1[0] || typeof c1[0]['winc'] === 'undefined') {
                throw new Error('Unable to retrieve upload costs from Turbo');
            }
            const c = Number(c1[0]['winc']);
            const a = c - b;

            token = 'turbo';
            balance = {
                atomic: b1['winc'],
                formatted: (b / 1000000000000).toString(),
            };
            cost = {
                atomic: c1[0]['winc'],
                formatted: (c / 1000000000000).toString(),
            };
            additional = {
                atomic: a > 0 ? a.toString() : '0',
                formatted: a > 0 ? (a / 1000000000000).toString() : '0',
            };
        } else {
            if (!this.key) {
                throw new Error('No key provided');
            }
            const wallet = this.arweave.wallets;
            const address = await wallet.getAddress(this.key);
            const b = BigNumber(await wallet.getBalance(address));
            const c = BigNumber(
                await this.arweave.transactions.getPrice(size, address),
            );
            const a = c.minus(b);

            token = 'arweave';
            balance = {
                atomic: b.toString(),
                formatted: this.arweave.ar.winstonToAr(b.toString()),
            };
            cost = {
                atomic: c.toString(),
                formatted: this.arweave.ar.winstonToAr(c.toString()),
            };
            additional = {
                atomic: a.isGreaterThan(0) ? a.toString() : '0',
                formatted: a.isGreaterThan(0)
                    ? this.arweave.ar.winstonToAr(a.toString())
                    : '0',
            };
        }
        return {
            token,
            cost,
            balance,
            additional,
        };
    }

    public async uploadData(
        opts: Types.UploadDataOpts,
    ): Promise<Transaction | UploadResponse | TurboUploadDataItemResponse> {
        if (this.irys) {
            const tx = uploadWithIrys({
                irys: this.irys,
                type: opts.type,
                data: opts.data,
                tags: opts.tags,
            });
            return tx;
        } else if (this.turbo) {
            const tx = uploadWithTurbo({
                turbo: this.turbo,
                type: opts.type,
                data: opts.data,
                tags: opts.tags,
            });
            return tx;
        } else {
            if (!this.arweave || !this.key) {
                throw new Error('Arweave and JWK must be defined');
            }
            const tx = uploadWithArweave({
                arweave: this.arweave,
                jwk: this.key,
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

export default Utilities;
