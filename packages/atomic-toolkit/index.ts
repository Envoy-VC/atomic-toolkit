import { describe, expect, it } from 'vitest';
import fs from 'fs';

import { WebIrys } from '@irys/sdk';
import { WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { ethers } from 'ethers';

import AtomicToolkit, { AtomicToolkitWeb } from './src/index';

// Load dotenv configuration from .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Load Atomic Asset Image
let buffer = fs.readFileSync('assets/test.jpeg');
let blob = new Blob([buffer]);
let file = new File([blob], 'trees-wallpaper.jpg', { type: 'image/jpeg' });

describe('AtomicToolkitWeb with Irys', () => {
    async function initialize() {
        let provider = new ethers.providers.JsonRpcProvider(
            process.env.RPC_URL,
        );
        if (!process.env.PRIVATE_KEY) {
            throw new Error('PRIVATE_KEY not found');
        }
        const ethersWallet = new ethers.Wallet(
            process.env.PRIVATE_KEY,
            provider,
        );
        const warp = WarpFactory.forTestnet().use(new DeployPlugin());
        const irys = new WebIrys({
            url: 'https://node2.irys.xyz',
            token: 'matic',
            wallet: {
                name: 'ethersv5',
                provider: {
                    ...ethersWallet,
                    getSigner: () => ethersWallet,
                },
            },
        });
        await irys.ready();

        const atomicToolkit = new AtomicToolkitWeb({
            warp,
            useIrys: true,
            irys,
        });

        return { warp, irys, atomicToolkit };
    }

    it('Should throw error if warp instance does not have deploy plugin', async () => {
        const warp = WarpFactory.forTestnet();
        const irys = new WebIrys({
            url: 'node1',
            token: 'matic',
        });
        expect(
            () => new AtomicToolkitWeb({ warp, useIrys: true, irys }),
        ).toThrowError('Warp instance must have DeployPlugin');
    });
    it('Should Create a Atomic Asset', async () => {
        const { atomicToolkit } = await initialize();
        const tx = await atomicToolkit.createAtomicAsset(file, {
            initialState: {
                ticker: 'Test',
                name: 'Test Image',
                description: 'Test Image',
                balances: {
                    'Z7t5Dw42qalSx9-1u4wINXWayX7Ktu_i3sbc31tSDb4': 1,
                },
                claimable: [],
            },
            discoverability: {
                Title: 'Test Image',
                Description: 'Test Image',
                Type: 'image',
                'Topic:Test': 'Test',
            },
            license: {
                License: 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8',
            },
        });
        expect(tx).toBeDefined();
    });
    it('Should Create a Collection', async () => {
        const { atomicToolkit } = await initialize();
        const tx = await atomicToolkit.createCollection({
            assetIds: ['QmZ7t5Dw42qalSx9-1u4wINXWayX7Ktu_i3sbc31tSDb4'],
            collection: {
                Name: 'Test Collection',
                'Collection-Type': 'Test',
            },
            discoverability: {
                Title: 'Test Collection',
                Description: 'Test Collection',
                Type: 'Document',
                'Topic:Test': 'Test',
            },
            stamp: {
                isStampable: true,
                collectionName: 'Test Collection',
                ticker: 'Test',
                owner: 'Z7t5Dw42qalSx9-1u4wINXWayX7Ktu_i3sbc31tSDb4',
            },
        });
        expect(tx).toBeDefined();
    });
});
