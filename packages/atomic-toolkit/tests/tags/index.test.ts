import { describe, expect, it } from 'vitest';

import {
    getContentTypeTag,
    buildDiscoverabilityTags,
    buildContractIdentifierTags,
    buildLicenseTags,
    buildTradableAssetTags,
    buildCollectionTags,
    buildAssetTags,
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
    it('Should have all necessary license tags', async () => {
        const tags = buildLicenseTags({
            license: 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8',
            access: 'public',
            accessFee: 'One-Time-0.1',
            derivation: 'Allowed-With-Credit',
            commercialUse: 'Allowed',
            licenseFee: 'One-Time-10',
            currency: 'AR',
            expires: '10',
            paymentAddress: '9WQ7xH2LOuqfAccjGquck8eaKARg1vMhRJaOo3LJL14',
            paymentMode: 'Global-Distribution',
            dataModelTraining: 'Allowed',
        });

        const expectedTags = [
            {
                name: 'License',
                value: 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8',
            },
            { name: 'Access', value: 'public' },
            { name: 'Access-Fee', value: 'One-Time-0.1' },
            { name: 'Derivation', value: 'Allowed-With-Credit' },
            { name: 'Commercial-Use', value: 'Allowed' },
            { name: 'License-Fee', value: 'One-Time-10' },
            { name: 'Currency', value: 'AR' },
            { name: 'Expires', value: '10' },
            {
                name: 'Payment-Address',
                value: '9WQ7xH2LOuqfAccjGquck8eaKARg1vMhRJaOo3LJL14',
            },
            { name: 'Payment-Mode', value: 'Global-Distribution' },
            { name: 'Data-Model-Training', value: 'Allowed' },
        ];

        expect(tags).to.deep.equal(expectedTags);
    });

    it('Should have all necessary Tradable Asset tags', async () => {
        const tags = buildTradableAssetTags('../assets/test-image.png', {
            initialState: {
                ticker: 'TEST',
                name: 'Test Image',
                description: 'A test image',
                balances: {
                    '9WQ7xH2LOuqfAccjGquck8eaKARg1vMhRJaOo3LJL14': 1,
                },
                claimable: [],
            },
            discoverability: {
                title: 'Test Image',
                description: 'A test image',
                type: 'image',
            },
        });

        const expectedKeys = [
            'Content-Type',
            'Type',
            'Title',
            'Description',
            'App-Name',
            'App-Version',
            'Contract-Src',
            'Init-State',
            'Contract-Manifest',
            'Indexed-By',
            'License',
        ];

        expect(tags.map((tag) => tag.name)).to.include.members(expectedKeys);
    });
    it('Should have all necessary Collection Tags', async () => {
        const tags = buildCollectionTags([], {
            assetIds: [],
            collection: {
                name: 'Test Collection',
                collectionType: 'images',
                thumbnail: '9WQ7xH2LOuqfAccjGquck8eaKARg1vMhRJaOo3LJL14',
                banner: '9WQ7xH2LOuqfAccjGquck8eaKARg1vMhRJaOo3LJL14',
                collectionCode: 'test-collection',
            },
            discoverability: {
                title: 'Test Image',
                description: 'A test image',
                type: 'Document',
            },
            stamp: {
                isStampable: true,
                ticker: 'TEST',
                collectionName: 'Test Collection',
                owner: '9WQ7xH2LOuqfAccjGquck8eaKARg1vMhRJaOo3LJL14',
            },
        });

        const expectedKeys = [
            'Collection-Type',
            'Thumbnail',
            'Banner',
            'Collection-Code',
            'Data-Protocol',
            'Name',
            'Type',
            'Title',
            'Description',
            'Content-Type',
            'App-Name',
            'App-Version',
            'Contract-Src',
            'Init-State',
        ];

        expect(tags.map((tag) => tag.name)).to.include.members(expectedKeys);
    });
    it('Should have all necessary Asset Tags', async () => {
        const tags = buildAssetTags('../assets/test-image.png', {
            discoverability: {
                title: 'Test Image',
                description: 'A test image',
                type: 'image',
            },
            license: {
                license: 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8',
            },
        });

        const expectedKeys = [
            'Type',
            'Title',
            'Description',
            'Content-Type',
            'License',
        ];

        expect(tags.map((tag) => tag.name)).to.include.members(expectedKeys);
    });
});
