import {
	CreateTradableAssetOpts,
	TradableAssetInitState,
	DiscoverabilityTags,
	LicenseTags,
} from 'atomic-toolkit';

import * as Types from '~/types';

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

	return {
		initialState,
		discoverability,
		license,
	};
};
