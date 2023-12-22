import { UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import {
	CreateTradableAssetOpts,
	TradableAssetInitState,
	DiscoverabilityTags,
	LicenseTags,
	CreateCollectionOpts,
} from 'atomic-toolkit';

import { State } from '~/stores/collection';
import { License } from '~/types';

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
	files,
	assets,
	banner,
	thumbnail,
	collection,
	license,
}: State): CreateCollectionOpts => {
	let opts = {} as CreateCollectionOpts;

	opts.assets = files as RcFile[];
	opts.thumbnail = thumbnail as RcFile;
	opts.banner = banner as RcFile;
	opts.license = buildLicenseOpts(license);
	opts.initState = {
		ticker: collection.ticker,
		balances: {
			[collection.owner]: parseInt(assets.units),
		},
	};
	opts.collection = {
		name: collection.name,
		collectionType: collection.collectionType,
	};
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
	return opts;
};
