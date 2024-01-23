import { describe, expect, it } from 'vitest';

import AtomicToolkit, { AtomicToolkitWeb } from '../../src';
import { TurboFactory } from '@ardrive/turbo-sdk';

import fs from 'fs';
const jwk = JSON.parse(fs.readFileSync('./wallet.json').toString());

describe('Atomic Asset GraphQL', () => {
    it('should return transaction', async () => {
        const toolkit = new AtomicToolkitWeb({});
        const res = await toolkit.assets.getAtomicAsset(
            'HbsnADOnipgjAlVWwH-cClIozntMm6ePuER6HZp8Qf8',
        );
        expect(res).toBeDefined();
    });
    it('should create atomic asset', async () => {
        const turbo = TurboFactory.authenticated({ privateKey: jwk });

        const toolkit = new AtomicToolkit({
            turbo,
        });

        const tx = await toolkit.assets.createAtomicAsset(
            './assets/test-image.jpeg',
            {
                initialState: {
                    name: 'Atomic Asset',
                    ticker: 'ATOMIC',
                    description: 'Atomic Asset description',
                    balances: {
                        'Z7t5Dw42qalSx9-1u4wINXWayX7Ktu_i3sbc31tSDb4': 1,
                    },
                    claimable: [],
                },
                discoverability: {
                    title: 'Atomic Asset',
                    description: 'Atomic Asset description',
                    type: 'image',
                },
                indexWithUCM: false,
                license: {
                    license: 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8',
                    commercialUse: 'Allowed',
                },
            },
        );

        console.log(tx);
    });
});
