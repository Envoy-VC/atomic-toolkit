import { Tag } from 'arbundles';

export const TRADABLE_ASSET_CONTRACT_SRC =
    'Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ';

export const BaseTradableAssetTags: Tag[] = [
    { name: 'App-Name', value: 'SmartWeaveContract' },
    { name: 'App-Version', value: '0.3.0' },
    { name: 'Contract-Src', value: TRADABLE_ASSET_CONTRACT_SRC },
    {
        name: 'Contract-Manifest',
        value: '{"evaluationOptions":{"sourceType":"redstone-sequencer","allowBigInt":true,"internalWrites":true,"unsafeClient":"skip","useConstructor":true}}',
    },
    { name: 'Indexed-By', value: 'ucm' },
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
