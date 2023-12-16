import { Tag } from 'arbundles';

export const TRADABLE_ASSET_CONTRACT_SRC =
    'Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ';

export const TradableAssetContractTags: Tag[] = [
    { name: 'App-Name', value: 'SmartWeaveContract' },
    { name: 'App-Version', value: '0.3.0' },
    { name: 'Contract-Src', value: TRADABLE_ASSET_CONTRACT_SRC },
    {
        name: 'Contract-Manifest',
        value: '{"evaluationOptions":{"sourceType":"redstone-sequencer","allowBigInt":true,"internalWrites":true,"unsafeClient":"skip","useConstructor":true}}',
    },
];

export const BaseCollectionTags: Tag[] = [
    {
        name: 'Content-Type',
        value: 'application/json',
    },
    {
        name: 'Data-Protocol',
        value: 'Collection',
    },
];

export const BaseLicenseTags: Tag[] = [
    {
        name: 'License',
        value: 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8',
    },
];

export type BaseTagType =
    | 'TradableAssetContractTags'
    | 'BaseCollectionTags'
    | 'BaseLicenseTags';

export const BaseTags: Record<BaseTagType, Tag[]> = {
    TradableAssetContractTags,
    BaseCollectionTags,
    BaseLicenseTags,
};
