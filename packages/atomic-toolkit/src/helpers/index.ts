import { Tag } from 'arbundles';
import { CreateTradableAssetOpts } from '../types';
import {
    ContractIdentifierTags,
    DiscoverabilityTags,
} from '../types';

import { BaseTradableAssetTags } from '../constants';

const addContentTypeTag = (file: File, tags: Tag[]): Tag[] => {
    const contentType = file.type;
    if (contentType) {
        tags.push({ name: 'Content-Type', value: contentType });
    }
    return tags;
};

const buildTradableAssetTags = (opts: CreateTradableAssetOpts): Tag[] => {
    const { discoverability, license, initialState } = opts;
    const contractIdentifier = opts?.contractIdentifier ?? null;
    const additionalTags = opts?.additionalTags ?? [];
    const tags: Tag[] = [];

    // Push Initial Contract State
    tags.push({ name: 'Init-State', value: initialState });

    // Push Discoverability Tags
    Object.keys(discoverability).forEach((key) => {
        tags.push({
            name: key,
            value: discoverability[key as keyof DiscoverabilityTags] ?? '',
        });
    });

    // Push License Tags
    Object.keys(license).forEach((key) => {
        tags.push({
            name: key,
            value: license[key] ?? '',
        });
    });

    if (contractIdentifier) {
        Object.keys(contractIdentifier).forEach((key) => {
            tags.push({
                name: key,
                value:
                    contractIdentifier[key as keyof ContractIdentifierTags] ??
                    '',
            });
        });
    } else {
        BaseTradableAssetTags.forEach((tag) => {
            tags.push(tag);
        });
    }

    // Push Additional Tags
    additionalTags.forEach((tag) => {
        tags.push(tag);
    });

    return tags;
};

export { buildTradableAssetTags, addContentTypeTag };
