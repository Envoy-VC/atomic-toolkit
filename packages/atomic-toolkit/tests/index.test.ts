import { describe, expect, it } from 'vitest';

import Arweave from 'arweave';
import Irys, { WebIrys } from '@irys/sdk';

import AtomicToolkit, { AtomicToolkitWeb } from '../src';
import { Warp } from 'warp-contracts';

describe('AtomicToolkit Class', () => {
    it('should create an instance with Arweave', async () => {
        const environment = 'mainnet';
        const arweave = Arweave.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https',
        });
        const jwk = await arweave.wallets.generate();
        const toolkit = new AtomicToolkit({
            environment,
            useIrys: false,
            jwk,
        });

        // Assertions
        expect(toolkit).to.be.an.instanceof(AtomicToolkit);
        expect(toolkit.warp).to.be.an.instanceOf(Warp); // Make sure the Warp instance is created
        expect(toolkit.warp.hasPlugin('deploy')).to.equal(true);
        expect(toolkit.useIrys).to.equal(false);
        expect(toolkit.irys).to.equal(null);
    });

    it('should create an instance with Irys', () => {
        const environment = 'mainnet';
        const useIrys = true;
        const irysConfig = {
            url: 'https://node2.irys.xyz',
            token: 'matic',
        };
        const irys = new Irys(irysConfig);
        const toolkit = new AtomicToolkit({ environment, useIrys, irys });

        // Assertions
        expect(toolkit).to.be.an.instanceof(AtomicToolkit);
        expect(toolkit.warp).to.be.an.instanceOf(Warp); // Make sure the Warp instance is created
        expect(toolkit.warp.hasPlugin('deploy')).to.equal(true);
        expect(toolkit.useIrys).to.equal(true);
        expect(toolkit.arweave).to.equal(null);
        expect(toolkit.irys).to.equal(irys);
    });
});

describe('AtomicToolkitWeb Class', () => {
    it('should create an instance with Arweave', async () => {
        const environment = 'mainnet';
        const arweave = Arweave.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https',
        });
        const jwk = await arweave.wallets.generate();
        const toolkit = new AtomicToolkitWeb({
            environment,
            useIrys: false,
            jwk,
        });

        // Assertions
        expect(toolkit).to.be.an.instanceof(AtomicToolkitWeb);
        expect(toolkit.warp).to.be.an.instanceOf(Warp); // Make sure the Warp instance is created
        expect(toolkit.warp.hasPlugin('deploy')).to.equal(true);
        expect(toolkit.useIrys).to.equal(false);
        expect(toolkit.irys).to.equal(null);
    });

    it('should create an instance with Irys', () => {
        const environment = 'mainnet';
        const useIrys = true;
        const irysConfig = {
            url: 'https://node2.irys.xyz',
            token: 'matic',
        };
        const irys = new WebIrys(irysConfig);
        const toolkit = new AtomicToolkitWeb({ environment, useIrys, irys });

        // Assertions
        expect(toolkit).to.be.an.instanceof(AtomicToolkitWeb);
        expect(toolkit.warp).to.be.an.instanceOf(Warp); // Make sure the Warp instance is created
        expect(toolkit.warp.hasPlugin('deploy')).to.equal(true);
        expect(toolkit.useIrys).to.equal(true);
        expect(toolkit.arweave).to.equal(null);
        expect(toolkit.irys).to.equal(irys);
    });
});
