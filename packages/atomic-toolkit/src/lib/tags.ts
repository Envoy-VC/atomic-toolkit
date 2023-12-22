import { Tag } from 'arbundles';
import {
    CreateTradableAssetOpts,
    CreateCollectionWithAssetIdsOpts,
} from '../types/asset';
import * as Tags from '../types/tags';

import { BaseTags, TRADABLE_ASSET_CONTRACT_SRC } from './constants';

import mime from 'mime';

/**
 * Retrieves the Content-Type tag for a given file.
 * @param file - The file or file path.
 * @returns The Content-Type tag.
 */
const getContentTypeTag = (file: File | string): Tag => {
    let contentType: string;

    if (file instanceof File) {
        contentType = file.type;
    } else {
        contentType = mime.getType(file) ?? '';
    }
    return { name: 'Content-Type', value: contentType };
};

/**
 * Builds discoverability tags based on the provided options.
 * @param opts - The options for building the discoverability tags.
 * @returns An array of tags.
 */
const buildDiscoverabilityTags = (opts: Tags.DiscoverabilityTags): Tag[] => {
    const tags: Tag[] = [];
    tags.push({ name: 'Title', value: opts.title });
    tags.push({ name: 'Description', value: opts.description });
    tags.push({ name: 'Type', value: opts.type });
    if (opts.topics) {
        opts.topics.forEach((topic) => {
            tags.push({ name: `Topic:${topic}`, value: topic });
        });
    }
    return tags;
};

/**
 * Builds an array of tags for a contract identifier.
 * @param opts - The options for building the tags.
 * @returns An array of tags.
 */
const buildContractIdentifierTags = (
    opts: Tags.ContractIdentifierTags,
): Tag[] => {
    const tags: Tag[] = [];
    tags.push({ name: 'App-Name', value: opts.appName });
    tags.push({ name: 'App-Version', value: opts.appVersion });
    tags.push({ name: 'Contract-Src', value: opts.contractSrc });
    tags.push({ name: 'Init-State', value: opts.initState });
    tags.push({ name: 'Contract-Manifest', value: opts.initState });
    return tags;
};

/**
 * Builds an array of tags based on the provided options for license tags.
 * @param opts - The options for license tags.
 * @returns An array of tags.
 */
const buildLicenseTags = (opts: Tags.LicenseTags): Tag[] => {
    const tags: Tag[] = [];
    tags.push({ name: 'License', value: opts.license });
    if (opts.access) {
        tags.push({ name: 'Access', value: opts.access });
    }
    if (opts.accessFee)
        tags.push({ name: 'Access-Fee', value: opts.accessFee });
    if (opts.derivation)
        tags.push({ name: 'Derivation', value: opts.derivation });
    if (opts.unknownUsageRights)
        tags.push({
            name: 'Unknown-Usage-Rights',
            value: opts.unknownUsageRights,
        });
    if (opts.commercialUse)
        tags.push({ name: 'Commercial-Use', value: opts.commercialUse });
    if (opts.licenseFee)
        tags.push({ name: 'License-Fee', value: opts.licenseFee });
    if (opts.currency)
        tags.push({
            name: 'Currency',
            value: opts.currency,
        });
    if (opts.expires)
        tags.push({
            name: 'Expires',
            value: opts.expires,
        });
    if (opts.paymentAddress)
        tags.push({
            name: 'Payment-Address',
            value: opts.paymentAddress,
        });
    if (opts.paymentMode)
        tags.push({
            name: 'Payment-Mode',
            value: opts.paymentMode,
        });
    if (opts.dataModelTraining) {
        tags.push({
            name: 'Data-Model-Training',
            value: opts.dataModelTraining,
        });
    }

    return tags;
};

/**
 * Builds collection-specific tags based on the provided options.
 * @param opts - The options for building the tags.
 * @returns An array of tags.
 */
const buildCollectionSpecificTags = (
    opts: Tags.CollectionSpecificTags,
): Tag[] => {
    const tags: Tag[] = [];
    tags.push({ name: 'Name', value: opts.name });
    tags.push({ name: 'Collection-Type', value: opts.collectionType });
    if (opts.thumbnail) tags.push({ name: 'Thumbnail', value: opts.thumbnail });
    if (opts.banner) tags.push({ name: 'Banner', value: opts.banner });
    if (opts.collectionCode)
        tags.push({ name: 'Collection-Code', value: opts.collectionCode });
    return tags;
};

/**
 * Checks for duplicate tags in an array of tags.
 * @param tags - The array of tags to check.
 * @throws {Error} - If duplicate tag names are found.
 */
const checkForDuplicateTags = (tags: Tag[]): void => {
    const duplicateTags = tags.filter(
        (tag, index, self) =>
            self.findIndex((t) => t.name === tag.name) !== index,
    );
    if (duplicateTags.length > 0) {
        throw new Error(
            `Duplicate tag names found: ${duplicateTags
                .map((tag) => tag.name)
                .join(', ')} with values ${duplicateTags.map(
                (tag) => tag.value,
            )})`,
        );
    }
};

/**
 * Builds an array of tags for a tradable asset based on the provided options.
 * @param file - The file associated with the tradable asset.
 * @param opts - The options for creating the tradable asset.
 * @returns An array of tags for the tradable asset.
 */
const buildTradableAssetTags = (
    file: File | string,
    opts: CreateTradableAssetOpts,
) => {
    const tags: Tag[] = [];
    let discoverabilityTags: Tag[] = [],
        licenseTags: Tag[] = [],
        contractIdentifierTags: Tag[] = [];

    discoverabilityTags = buildDiscoverabilityTags(opts.discoverability);
    if (opts.license) {
        licenseTags = buildLicenseTags(opts.license);
    } else {
        licenseTags = BaseTags['BaseLicenseTags'];
    }

    if (opts.contractIdentifier !== undefined) {
        contractIdentifierTags = buildContractIdentifierTags(
            opts.contractIdentifier,
        );
    } else {
        contractIdentifierTags.push(...BaseTags['TradableAssetContractTags']);
        contractIdentifierTags.push({
            name: 'Init-State',
            value: JSON.stringify(opts.initialState),
        });
    }

    const { indexWithUCM = true } = opts;

    if (indexWithUCM) {
        tags.push({ name: 'Indexed-By', value: 'ucm' });
    }

    tags.push(...discoverabilityTags);
    tags.push(...licenseTags);
    tags.push(...contractIdentifierTags);
    tags.push(...(opts.additionalTags ?? []));
    tags.push(getContentTypeTag(file));

    checkForDuplicateTags(tags);

    return tags;
};

/**
 * Builds a collection of tags based on the provided options.
 * @param opts - The options for building the collection tags.
 * @returns An array of tags.
 */
const buildCollectionTags = (
    baseTags: Tag[],
    opts: CreateCollectionWithAssetIdsOpts,
): Tag[] => {
    const tags: Tag[] = baseTags;
    const { collection, discoverability, stamp, additionalTags } = opts;

    let collectionSpecificTags: Tag[],
        discoverabilityTags: Tag[],
        stampTags: Tag[];

    collectionSpecificTags = buildCollectionSpecificTags(collection);
    discoverabilityTags = buildDiscoverabilityTags(discoverability);

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

    tags.push(...BaseTags['BaseCollectionTags']);
    tags.push(...collectionSpecificTags);
    tags.push(...discoverabilityTags);
    tags.push(...(additionalTags ?? []));

    checkForDuplicateTags(tags);

    return tags;
};

const buildAssetTags = (file: File | string, opts: Tags.AssetTags): Tag[] => {
    const tags: Tag[] = [];
    let discoverabilityTags: Tag[] = [],
        licenseTags: Tag[] = [];

    discoverabilityTags = buildDiscoverabilityTags(opts.discoverability);

    if (opts.license) {
        licenseTags = buildLicenseTags(opts.license);
    } else {
        licenseTags = BaseTags['BaseLicenseTags'];
    }

    tags.push(...discoverabilityTags);
    tags.push(...licenseTags);
    tags.push(...(opts.additionalTags ?? []));
    tags.push(getContentTypeTag(file));

    checkForDuplicateTags(tags);

    return tags;
};

export {
    buildTradableAssetTags,
    buildCollectionTags,
    buildAssetTags,
    getContentTypeTag,
    buildDiscoverabilityTags,
    buildContractIdentifierTags,
};
