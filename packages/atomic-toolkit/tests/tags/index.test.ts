import { describe, expect, it } from 'vitest';

import {
    getContentTypeTag,
    buildDiscoverabilityTags,
    buildContractIdentifierTags,
} from '../../src/lib/tags';

describe('Content-Type Tags', () => {
    it('Should Determine Correct Content Types', async () => {
        const file = new File([''], 'image.png', { type: 'image/png' });
        const tagForFile = getContentTypeTag(file);
        const tagForPath = getContentTypeTag('../assets/test-image.png');
        const tag = { name: 'Content-Type', value: 'image/png' };
        expect(tagForFile).to.deep.equal(tag);
        expect(tagForPath).to.deep.equal(tag);
    });
    it('Should have all necessary discoverability tags', async () => {
        const tags = buildDiscoverabilityTags({
            type: 'image',
            title: 'Test Image',
            description: 'A test image',
            topics: ['test', 'image'],
        });

        expect(tags.length).to.equal(5);
        const requiredTags = ['Type', 'Title', 'Description'];
        expect(tags.map((tag) => tag.name)).to.include.members(requiredTags);
    });
    it('Should have all necessary contract Identifier  tags', async () => {
        const tags = buildContractIdentifierTags({
            appName: 'Test App',
            appVersion: '1.0.0',
            contractSrc: 'p5OI99-BaY4QbZts266T7EDwofZqs-wVuYJmMCS0SUU',
            initState: JSON.stringify({
                name: 'Test App',
                balances: {
                    '9WQ7xH2LOuqfAccjGquck8eaKARg1vMhRJaOo3LJL14': 1,
                },
                claimable: [],
            }),
            contractManifest: JSON.stringify({
                evaluationOptions: {
                    sourceType: 'redstone-sequencer',
                    allowBigInt: true,
                    internalWrites: true,
                    unsafeClient: 'skip',
                    useConstructor: true,
                },
            }),
        });

        expect(tags.length).to.equal(5);
        const requiredTags = [
            'App-Name',
            'App-Version',
            'Contract-Src',
            'Init-State',
            'Contract-Manifest',
        ];
        expect(tags.map((tag) => tag.name)).to.include.members(requiredTags);
    });
});
