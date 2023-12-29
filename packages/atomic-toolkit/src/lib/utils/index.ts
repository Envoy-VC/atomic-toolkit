// Types
import * as Types from '../../types';
import AtomicToolkitBase from '../../base';

import BigNumber from 'bignumber.js';

class Utilities extends AtomicToolkitBase {
    constructor(
        opts: Types.AtomicToolkitNodeOpts | Types.AtomicToolkitWebOpts,
    ) {
        super(opts);
    }

    public getDirectorySize(directoryPath: string) {
        let totalSize = 0;
        const fs = require('fs');
        const path = require('path');
        function calculateSize(filePath: string) {
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
        calculateSize(directoryPath);
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
        } else {
            if (!this.key) {
                throw new Error('No key provided');
            }
            const wallet = this.arweaveInstance.wallets;
            const address = await wallet.getAddress(this.key);
            const b = BigNumber(await wallet.getBalance(address));
            const c = BigNumber(
                await this.arweaveInstance.transactions.getPrice(size, address),
            );
            const a = c.minus(b);

            token = 'arweave';
            balance = {
                atomic: b.toString(),
                formatted: this.arweaveInstance.ar.winstonToAr(b.toString()),
            };
            cost = {
                atomic: c.toString(),
                formatted: this.arweaveInstance.ar.winstonToAr(c.toString()),
            };
            additional = {
                atomic: a.isGreaterThan(0) ? a.toString() : '0',
                formatted: a.isGreaterThan(0)
                    ? this.arweaveInstance.ar.winstonToAr(a.toString())
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
}

export default Utilities;
