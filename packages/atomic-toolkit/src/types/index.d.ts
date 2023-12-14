import { Warp } from 'warp-contracts';
import Irys, { WebIrys } from '@irys/sdk';
import { DataItemCreateOptions } from 'arbundles';
import { Tag } from 'arbundles';

export type AtomicToolkitOpts = {
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp: Warp;
    /**
     * Web Irys instance for uploading Assets
     */
    irys: Irys;
};

export type AtomicToolkitWebOpts = {
    /**
     * A Warp instance that uses DeployPlugin
     */
    warp: Warp;
    /**
     * Web Irys instance for uploading Assets
     */
    irys: WebIrys;
};

export type DiscoverabilityTags = Record<`Topic:${string}`, string> & {
    /**
     * Type of asset. One or more of: meme, image, video, podcast, blog-post, social-post, music, audio, token, web-page,
     * profile, contract, presentation, document, collection, app, other note: If you have further suggestions for asset
     * type please submit a revised spec.
     */
    Type: string;
    /**
     * A maximum of 150 characters used to identify the content, this title can provide a quick eye catching description of
     * the asset
     */
    Title: string;
    /**
     * A longer description of 300 characters that can provide a set of details further describing the asset
     */
    Description: string;
};

export type ContractIdentifierTags = {
    /**
     * SmartWeaveContract - Flags this TX as a SmartWeave Contract
     */
    'App-Name': string;
    /**
     * The version of SmartWeave that is supported. eg- 0.3.0
     */
    'App-Version': string;
    /**
     * The source code for the contract. eg- Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ
     */
    'Contract-Src': string;
    /**
     * The starting state of the contract
     */
    'Init-State': string;
    /**
     * The manifest required to properly evaluate
     */
    'Contract-Manifest': string;
    /**
     * The tag to work with universal market place. eg- ucm
     */
    'Indexed-By': string;
};

export type LicenseTags = Record<string, string> & {
    /**
     * The license you are using. eg- yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8
     */
    License: string;
    'Access-Fee'?: string;
    /**
     * Allowed-With-Credit
     *
     * Allowed-With-Indication
     *
     * Allowed-With-License-Passthrough
     *
     * Allowed-With-RevenueShare-[.0-9+]%
     *
     * [Before/After]-[0-9+]-Years-Derivation
     */
    Derivation?: string;
    /**
     * If no “Unknown-Usage-Rights” tag is present, unknown usage rights are included where available according to
     * Section 10 - Unknown Rights Of Use.
     *
     * https://udlicense.arweave.dev/#h.h7gw8o21tsgm
     */
    'Unknown-Usage-Rights'?: string;
    /**
     * Allowed
     *
     * Allowed-With-Credit
     *
     * [Before/After]-[0-9+]-Years-Commercial-Use
     *
     * If no “Commercial-Use” tag is present, commercial use is not allowed according to Section 6 - Commercial Use.
     *
     * https://udlicense.arweave.dev/#h.qeh561rz2au9
     */
    'Commercial-Use'?: string;
    /**
     * Along with "Commercial-Use" rights is the ability to describe a one time or monthly license fee associated with tha
     * use. If no "License-Fee" tag is present there is no fee for the license, if it is the UDL defines one of two values.
     *
     * Monthly-[.0-9+]
     *
     * One-Time-[.0-9+]
     *
     * eg-
     *
     * "License-Fee" : "One-Time-1500"
     *
     * "License-Fee" : "Monthly-200"
     */
    'License-Fee'?: string;
    /**
     * As payments can be denominated in a variety of different units the "Currency" tag indicates which denomination the
     * owner(s) is/are expecting payment in. It should note that the currency used should be compatible with the owner
     * address(es) attached to the asset.
     *
     * If the "Currency" tag is not provided, the currency defaults to the $U token on the Arweave network.
     *
     * eg- "Currency" : "AR"
     */
    Currency?: string;
    /**
     * The value for the "Expires" tag is designated in years following the format "[0-9+]".
     *
     * eg-  Expires: 5
     */
    Expires?: string;
    /**
     * By default if no "Payment-Address" tag is present the address to receive payment is the one that signed the
     * transaction that posted the content to Arweave.
     *
     * If present, the "Payment-Address" tag overrides the signer of the transaction as the address to receive payment.
     *
     * eg- "Payment-Address" : "89tR0-C1m3_sCWCoVCChg4gFYKdiH5_ZDyZpdJ2DDRw"
     */
    'Payment-Address'?: string;
    /**
     * The "Payment-Mode" tag is used to indicate the payment mode for the asset. The payment mode can be one of
     *
     * Random-Distribution: if provided as the value of the “Payment-Mode” tag, Payments shall be distributed randomly
     * between all Payment Addresses proportional to their respective PST holdings
     *
     * Global-Distribution: Payments shall be distributed equally between all Payment Addresses proportional to their
     * respective PST holdings
     *
     * If no ”Payment-Mode” tag is present, Payments shall be made to the Payment Address(es)
     */
    'Payment-Mode'?: string;
};

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
     * List of Claimable Addresses for the Asset. eg- ["Z7t5Dw42qalSx9-1u4wINXWayX7Ktu_i3sbc31tSDb4"]
     */
    claimable: string[];
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
    discoverability: DiscoverabilityTags;
    /**
     * The license tags associated with the asset.
     */
    license: LicenseTags;
    /**
     * The contract identifier tags associated with the asset.
     */
    contractIdentifier?: ContractIdentifierTags;
    /**
     * Additional tags associated with the asset.
     */
    additionalTags?: Tag[];
};

export type CollectionSpecificTags = {
    /**
     * The Name of the collection
     */
    Name: string;
    /**
     * The collection type defines the collection for other applications to consume, e.g. "assets", "images", "media",
     * "audio", "video", "products"
     */
    'Collection-Type': string;
    /**
     * Optional TX_ID pointing to a thumbnail image recommended size 200x200
     */
    Thumbnail?: string;
    /**
     * Optional TX_ID pointing to a banner image recommended size 1600x900 pixels
     */
    Banners?: string;
    /**
     * Optional ID that enables assets to cross-link to collection document
     */
    'Collection-Code'?: string;
};

/**
 * Represents a stampable type.
 * @template T - A boolean type parameter.
 * @param T - A boolean value indicating whether the type is stampable.
 * @returns If T is true, returns an object with stampable properties. Otherwise, returns an object with isStampable set to false.
 */
export type StampableType<T extends boolean> = T extends true
    ? {
          isStampable: true;
          owner: string;
          collectionName: string;
          ticker: string;
      }
    : { isStampable: false };

/**
 * Represents the options for a collection.
 */
export type CollectionOpts = {
    /**
     * The Atomic Assets to be Included in the collection
     */
    assetIds: string[];
    /**
     * The Collection Specific tags as per specification
     *
     * https://specs.arweave.dev/?tx=4zqtz8-U4LNKjFU4gZ28oKkV6bTlfzJiguqjbMl9R4Q
     */
    collection: CollectionSpecificTags;
    /**
     * The discoverability tags associated with the asset.
     */
    discoverability: Omit<DiscoverabilityTags, 'Type'> & { Type: 'Document' };
    /**
     * Optional Atomic Assets Tags if you want the Collection to be Stampable.
     *
     * Defaults to false
     */
    stamp?: StampableType<boolean>;
    /**
     * Additional tags associated with the asset.
     */
    additionalTags?: Tag[];
};
