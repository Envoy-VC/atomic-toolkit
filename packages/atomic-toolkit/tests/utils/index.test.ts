import { describe, expect, it } from 'vitest';

import AtomicToolkit from '../../src';

import Irys from '@irys/sdk';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { readFileSync } from 'fs';
const key = JSON.parse(readFileSync('./wallet.json').toString());

describe('Utilities', () => {
    it('should return cost to upload data using arweave', async () => {
        const toolkit = new AtomicToolkit({
            key,
        });

        const cost = await toolkit.utils.getUploadCost(10 ** 9);
        expect(cost).toBeDefined();
    });
    it('should return cost to upload data using irys', async () => {
        const irys = new Irys({
            url: 'https://node2.irys.xyz',
            token: 'matic',
            key: process.env.PRIVATE_KEY,
        });

        await irys.ready();
        const toolkit = new AtomicToolkit({
            irys,
        });

        const cost = await toolkit.utils.getUploadCost(10 ** 9);
        expect(cost).toBeDefined();
    });
    it('should return directory size', async () => {
        const toolkit = new AtomicToolkit({
            key,
        });

        const res = toolkit.utils.getDirectorySize('./dist');
        expect(res).toBeDefined();
    });
});
