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
