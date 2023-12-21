import { describe, expect, it } from 'vitest';

import Arweave from 'arweave';
import Irys, { WebIrys } from '@irys/sdk';

import AtomicToolkit, { AtomicToolkitWeb } from '../src';
import { Warp } from 'warp-contracts';

describe('AtomicToolkit Class', () => {
    it('should create an instance with Arweave', async () => {
        const arweave = Arweave.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https',
        });
        const jwk = await arweave.wallets.generate();
        const toolkit = new AtomicToolkit({
            jwk,
        });

        // Assertions
        expect(toolkit).to.be.an.instanceof(AtomicToolkit);
    });

    it('should create an instance with Irys', () => {
        const irysConfig = {
            url: 'https://node2.irys.xyz',
            token: 'matic',
        };
        const irys = new Irys(irysConfig);
        const toolkit = new AtomicToolkit({ irys });

        // Assertions
        expect(toolkit).to.be.an.instanceof(AtomicToolkit);
    });
});

describe('AtomicToolkitWeb Class', () => {
    it('should create an instance with Arweave', async () => {
        const arweave = Arweave.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https',
        });
        const jwk = await arweave.wallets.generate();
        const toolkit = new AtomicToolkitWeb({
            jwk,
        });

        // Assertions
        expect(toolkit).to.be.an.instanceof(AtomicToolkitWeb);
    });

    it('should create an instance with Irys', () => {
        const irysConfig = {
            url: 'https://node2.irys.xyz',
            token: 'matic',
        };
        const irys = new WebIrys(irysConfig);
        const toolkit = new AtomicToolkitWeb({ irys });

        // Assertions
        expect(toolkit).to.be.an.instanceof(AtomicToolkitWeb);
    });
});
