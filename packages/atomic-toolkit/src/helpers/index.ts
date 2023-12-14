import { Tag } from 'arbundles';
import { CreateTradableAssetOpts } from '../types';
import { ContractIdentifierTags, DiscoverabilityTags } from '../types';

import { BaseTradableAssetTags } from '../constants';

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
    tags.push({ name: 'Init-State', value: initialState });
    tags.push(...map(discoverability, (value, key) => ({ name: key, value })));
    tags.push(...map(license, (value, key) => ({ name: key, value })));
    tags.push(
        ...map(contractIdentifier, (value, key) => ({
            name: key,
            value: get(value, key, ''),
        })),
    );

    if (!contractIdentifier) {
        tags.push(...BaseTradableAssetTags);
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

export { buildTradableAssetTags };
