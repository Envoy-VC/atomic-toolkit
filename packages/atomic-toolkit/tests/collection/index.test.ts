import { describe, expect, it } from 'vitest';

import { AtomicToolkitWeb } from '../../src';

describe('Collection GraphQL', () => {
    it('should return collection', async () => {
        const toolkit = new AtomicToolkitWeb({});
        const res = await toolkit.collection.getCollection(
            'naUSbwwYgZo1Zo8wD1jsWNTulydnccOTnx6eOyzy5AM',
        );
        console.log(res);
        expect(res).toBeDefined();
    });
});
