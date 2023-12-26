import { describe, expect, it } from 'vitest';

import { AtomicToolkitWeb } from '../../src';

describe('Atomic Asset GraphQL', () => {
    it('should return transaction', async () => {
        const toolkit = new AtomicToolkitWeb({});
        const res = await toolkit.assets.getAtomicAsset(
            'HbsnADOnipgjAlVWwH-cClIozntMm6ePuER6HZp8Qf8',
        );
        expect(res).toBeDefined();
    });
});
