import { describe, expect, it } from 'vitest';
import fs from 'fs';

import { WebIrys } from '@irys/sdk';
import { WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { ethers } from 'ethers';

import { AtomicToolkitWeb } from '../index';

// Load dotenv configuration from .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Load Atomic Asset Image
let buffer = fs.readFileSync('assets/test.jpeg');
let blob = new Blob([buffer]);
let file = new File([blob], 'trees-wallpaper.jpg', { type: 'image/jpeg' });

describe('Atomic Toolkit Web', () => {
    it('Should be a Class', () => {
        expect(AtomicToolkitWeb).toBeInstanceOf(Function);
    });
    it('Should have createAtomicAssetFunction', async () => {
        const warp = WarpFactory.forTestnet().use(new DeployPlugin());
        const irys = new WebIrys({
            url: 'node1',
            token: 'matic',
        });
        const atomicToolkit = new AtomicToolkitWeb({
            warp,
            irys,
        });
        expect(atomicToolkit.createAtomicAsset).toBeInstanceOf(Function);
    });
    it('Should throw error if warp instance does not have deploy plugin', async () => {
        const warp = WarpFactory.forTestnet();
        const irys = new WebIrys({
            url: 'node1',
            token: 'matic',
        });
        expect(() => new AtomicToolkitWeb({ warp, irys })).toThrowError(
            'Warp instance must have DeployPlugin',
        );
    });
    it('Should Create a Atomic Asset', async () => {
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
            irys,
        });
        const tx = await atomicToolkit.createAtomicAsset(file, {
            initialState: JSON.stringify({
                balances: {
                    'Z7t5Dw42qalSx9-1u4wINXWayX7Ktu_i3sbc31tSDb4': 1,
                },
                name: 'Test Image',
                description: 'Test Image',
                ticker: 'Test',
                claimable: [],
            }),
            discoverability: {
                Title: 'Test Image',
                Description: 'Test Image',
                Type: 'image',
            },
            license: {
                License: 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8',
            },
        });
        console.log(tx);
        expect(tx).toBeDefined();
    });
});
