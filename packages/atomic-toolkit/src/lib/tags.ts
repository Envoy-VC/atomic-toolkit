import { Tag } from 'arbundles';
import { CreateTradableAssetOpts, CollectionOpts } from '../types/asset';

import { BaseTags, TRADABLE_ASSET_CONTRACT_SRC } from './constants';

import mime from 'mime';
import { map, get } from 'lodash';

const addContentTypeTag = (file: File | string, tags: Tag[]): Tag[] => {
    let contentType: string;
    if (tags.filter((t) => t.name === 'Content-Type').length > 0) {
        return tags;
    }

    if (file instanceof File) {
        contentType = file.type;
    } else {
        contentType = mime.getType(file) ?? '';
    }
    tags.push({ name: 'Content-Type', value: contentType });
    return tags;
};

const buildTradableAssetTags = (
    file: File | string,
    opts: CreateTradableAssetOpts,
): Tag[] => {
    const {
        discoverability,
        license,
        initialState,
        contractIdentifier,
        additionalTags = [],
    } = opts;

    const tags: Tag[] = [];
    tags.push({ name: 'Init-State', value: JSON.stringify(initialState) });
    tags.push(...map(discoverability, (value, key) => ({ name: key, value })));
    tags.push(...map(license, (value, key) => ({ name: key, value })));
    tags.push(
        ...map(contractIdentifier, (value, key) => ({
            name: key,
            value: value ?? '',
        })),
    );

    if (!contractIdentifier) {
        tags.push(...BaseTags['BaseTradableAssetTags']);
    }

    tags.push(...additionalTags);

    // Check for Duplicates
    const duplicateTags = tags.filter(
        (tag, index, self) =>
            self.findIndex((t) => t.name === tag.name) !== index,
    );
    if (duplicateTags.length > 0) {
        throw new Error(
            `Duplicate tag names found: ${duplicateTags
                .map((tag) => tag.name)
                .join(', ')}`,
        );
    }
    // Add Content Type
    return addContentTypeTag(file, tags);
};

const buildCollectionTags = (opts: CollectionOpts): Tag[] => {
    const tags: Tag[] = [];
    const { collection, discoverability, stamp } = opts;

    tags.push(...BaseTags['BaseCollectionTags']);
    tags.push(
        ...map(collection, (value, key) => ({
            name: key,
            value: value ?? '',
        })),
    );
    tags.push(...map(discoverability, (value, key) => ({ name: key, value })));

    if (stamp?.isStampable === true) {
        const { ticker, collectionName, owner } = stamp;
        tags.push({ name: 'App-Name', value: 'SmartWeaveContract' });
        tags.push({ name: 'App-Version', value: '0.3.0' });
        tags.push({ name: 'Contract-Src', value: TRADABLE_ASSET_CONTRACT_SRC });
        tags.push({
            name: 'Init-State',
            value: JSON.stringify({
                ticker,
                name: collectionName,
                claimable: [],
                transferable: true,
                balances: {
                    [owner]: 1,
                },
            }),
        });
    }

    // Check for Duplicates
    const duplicateTags = tags.filter(
        (tag, index, self) =>
            self.findIndex((t) => t.name === tag.name) !== index,
    );
    if (duplicateTags.length > 0) {
        throw new Error(
            `Duplicate tag names found: ${duplicateTags
                .map((tag) => tag.name)
                .join(', ')}`,
        );
    }

    return tags;
};

export { buildTradableAssetTags, buildCollectionTags };
