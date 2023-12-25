import { Tag } from 'arbundles';
import * as Tags from './tags';

/**
 * Represents the initial state of a tradable asset.
 */
export type TradableAssetInitState = Record<string, any> & {
    /**
     * Ticker for the Asset. eg- ATOMIC
     */
    ticker: string;
    /**
     * Name of the Asset. eg- Atomic Asset
     */
    name: string;
    /**
     * List of Balances for the Asset. eg- { "Z7t5Dw42qalSx9-1u4wINXWayX7Ktu_i3sbc31tSDb4": 1 }
     */
    balances: Record<string, number>;
    /**
     * List of Claimable Addresses for the Asset.
     */
    claimable: ClaimableType[];
};

export type ClaimableType = {
    /**
     * Arweave Address who called the claim Function.
     */
    from: string;
    /**
     * Quantity of the Asset to be claimed.
     */
    qty: number;
    /**
     * The Arweave Address to which the Asset is to be transferred.
     */
    to: string;
    /**
     * The Transaction ID of the Transaction which called the claim Function.
     */
    txID: string;
};

/**
 * Options for creating a tradable asset.
 */
export type CreateTradableAssetOpts = {
    /**
     * The initial state of the asset.
     */
    initialState: TradableAssetInitState;
    /**
     * The discoverability tags associated with the asset.
     */
    discoverability: Tags.DiscoverabilityTags;
    /**
     * The license tags associated with the asset.
     */
    license?: Tags.LicenseTags;
    /**
     * The contract identifier tags associated with the asset.
     */
    contractIdentifier?: Tags.ContractIdentifierTags;
    /**
     * Wether to Index the Asset (Making it tradable on Marketplaces like BazAR)
     *
     * @default true
     */
    indexWithUCM?: boolean;
    /**
     * Additional tags associated with the asset.
     */
    additionalTags?: Tag[];
};

/**
 * Options for creating an asset.
 */
export type CreateAssetOpts = {
    /**
     * Asset File can be file or relative path.
     */
    file: File | string;
    /**
     * Asset Tags
     */
    tags: Tags.AssetTags;
};

/**
 * Options for Uploading Data
 */
export type UploadDataOpts = {
    type: 'data' | 'file';
    /**
     * Asset File can be file or relative path.
     */
    data: File | string;
    /**
     * Asset Tags
     */
    tags: Tag[];
};
