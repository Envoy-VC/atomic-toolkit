import * as Tags from './tags';
import { Tag } from 'arbundles';

/**
 * Represents a stampable type.
 */
export type StampableType =
    | {
          isStampable: true;
          /**
           * Owner of the Collection
           */
          owner: string;
          /**
           * Collection Name
           */
          collectionName: string;
          /**
           * Collection Ticker
           */
          ticker: string;
      }
    | { isStampable: false };

/**
 * Represents the options for a collection.
 */
export type CreateCollectionWithAssetIdsOpts = {
    /**
     * The Atomic Assets to be Included in the collection
     */
    assetIds: string[];
    /**
     * The Collection Specific tags as per specification
     *
     * https://specs.arweave.dev/?tx=4zqtz8-U4LNKjFU4gZ28oKkV6bTlfzJiguqjbMl9R4Q
     */
    collection: Tags.CollectionSpecificTags;
    /**
     * The discoverability tags associated with the asset.
     */
    discoverability: Omit<Tags.DiscoverabilityTags, 'type'> & {
        type: 'Document';
    };
    /**
     * Optional Atomic Assets Tags if you want the Collection to be Stampable.
     *
     * Defaults to false
     */
    stamp?: StampableType;
    /**
     * Additional tags associated with the asset.
     */
    additionalTags?: Tag[];
};

export type CollectionProgress = {
    step: string;
    progress: number;
};

export type CreateCollectionOpts = {
    /**
     * Atomic assets can be a Array of files or folder directory.
     */
    assets: File[] | string;
    /**
     * The Collection Thumbnail File or relative path. (recommended size: 300x300)
     */
    thumbnail: File | string;
    /**
     * The Collection Banner File or relative path. (recommended size: 1600x900)
     */
    banner: File | string;
    /**
     * License Tags associated with the Collection. Same License tags will be
     * applied to all the Atomic Assets.
     */
    license: Tags.LicenseTags;
    /**
     * Initial State for the Atomic Assets
     */
    initState: {
        ticker: string;
        balances: Record<string, number>;
    };
    /**
     * The Collection Specific tags as per specification
     */
    collection: Omit<Tags.CollectionSpecificTags, 'thumbnail' | 'banner'>;
    /**
     * The discoverability tags associated with the collection.
     */
    discoverability: Omit<Tags.DiscoverabilityTags, 'type'> & {
        type: 'Document';
    };
    /**
     * Tags associated with stamps. Use this if you want your collection to be stampable.
     */
    stamp?: StampableType;
    /**
     * Additional tags associated with the collection.
     */
    additionalTags?: Tag[];
};
