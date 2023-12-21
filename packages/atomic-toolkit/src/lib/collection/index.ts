// Helper functions
import { buildAssetTags, buildCollectionTags } from '../tags';

// Types
import { Tag } from 'arbundles';
import * as Types from '../../../types';
import Transaction from 'arweave/node/lib/transaction';
import { UploadResponse } from '@irys/sdk/build/cjs/common/types';
import AtomicToolkitBase from '../../base';

class Collection extends AtomicToolkitBase {
    constructor(
        opts: Types.AtomicToolkitNodeOpts | Types.AtomicToolkitWebOpts,
    ) {
        super(opts);
    }

    public async createCollection(
        opts: Types.CollectionOpts,
    ): Promise<UploadResponse | Transaction> {
        const data = {
            type: 'Collection',
            items: opts.assetIds,
        };
        const baseTags: Tag[] = [];

        if (opts.thumbnail) {
            const thumbnailTx = await this.uploadData({
                type: 'file',
                data: opts.thumbnail.file,
                tags: buildAssetTags(opts.thumbnail.file, opts.thumbnail.tags),
            });
            baseTags.push({
                name: 'Thumbnail',
                value: thumbnailTx.id,
            });
        }

        if (opts.banner) {
            const bannerTx = await this.uploadData({
                type: 'file',
                data: opts.banner.file,
                tags: buildAssetTags(opts.banner.file, opts.banner.tags),
            });
            baseTags.push({
                name: 'Banner',
                value: bannerTx.id,
            });
        }

        const tags = buildCollectionTags(baseTags, opts);
        const tx = this.uploadData({
            type: 'data',
            data: JSON.stringify(data),
            tags,
        });
        return tx;
    }
}

export default Collection;
