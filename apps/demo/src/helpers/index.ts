import { UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import {
	CreateCollectionWithAssetIdsOpts,
	CreateTradableAssetOpts,
	TradableAssetInitState,
	DiscoverabilityTags,
	LicenseTags,
} from 'atomic-toolkit';

import { State } from '~/stores/collection';
import { CollectionDetails, CollectionAssets, License } from '~/types';

import * as Types from '~/types';

export const buildLicenseOpts = (l: License): LicenseTags => {
	let license: LicenseTags;
	if (l.useDefaultLicense) {
		license = {
			license: 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8',
		};
	} else {
		// remove and extract fee and fee type fro object
		const feeType = l.feeType;
		const fee = l.fee;
		delete l.fee;
		delete l.feeType;
		license = l;
		if (feeType && fee && feeType !== 'None')
			license.licenseFee = `${feeType}-${fee}`;
	}
	return license;
};

export const buildOptions = (opts: {
	initialState: Types.InitialState;
	discoverability: DiscoverabilityTags;
	license: Types.License;
}): CreateTradableAssetOpts => {
	const { initialState: i, discoverability, license: l } = opts;
	const balances: Record<string, number> = {};

	i.balances.forEach((i) => {
		balances[i.address as string] = i.balance;
	});

	const initialState: TradableAssetInitState = {
		ticker: i.ticker,
		name: i.name,
		claimable: [],
		balances: balances,
	};

	const license = buildLicenseOpts(l);

	return {
		initialState,
		discoverability,
		license,
	};
};

interface BuildCollectionOptsProps extends State {
	assetIds: string[];
}

export const buildCollectionOpts = ({
	thumbnail,
	banner,
	collection,
	assetIds,
	license,
}: BuildCollectionOptsProps): CreateCollectionWithAssetIdsOpts => {
	let opts = {} as CreateCollectionWithAssetIdsOpts;

	const licenseOpts = buildLicenseOpts(license);

	// Collection
	opts.collection = {
		name: collection.name,
		collectionType: collection.collectionType,
	};

	if (thumbnail) {
		opts.thumbnail = {
			file: thumbnail as RcFile,
			tags: {
				discoverability: {
					type: 'image',
					title: `${collection.name} Thumbnail`,
					description: 'Thumbnail for collection',
				},
				license: licenseOpts,
				additionalTags: [],
			},
		};
	}

	if (banner) {
		opts.banner = {
			file: thumbnail as RcFile,
			tags: {
				discoverability: {
					type: 'image',
					title: `${collection.name} Banner`,
					description: 'Banner for collection',
				},
				license: licenseOpts,
				additionalTags: [],
			},
		};
	}

	opts.discoverability = {
		type: 'Document',
		title: collection.name,
		description: collection.description,
		topics: collection.topics,
	};

	if (collection.isStampable) {
		opts.stamp = {
			isStampable: true,
			ticker: collection.ticker,
			collectionName: collection.name,
			owner: collection.owner,
		};
	} else {
		opts.stamp = {
			isStampable: false,
		};
	}

	opts.assetIds = assetIds;

	return opts;
};
