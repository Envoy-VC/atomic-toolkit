import { UploadFile } from 'antd';

export type InitialState = {
	ticker: string;
	name: string;
	balances: { address: string; balance: number }[];
};

export type Discoverability = {
	indexWithUCM: boolean;
	type: string;
	title: string;
	description: string;
	topics: string[];
};

export type License = {
	useDefaultLicense: boolean;
	license: string;
	feeType?: string;
	fee?: number;
	commercialUse?: string;
	currency?: string;
	derivation?: string;
	paymentAddress?: string;
	expires?: string;
};

export type CollectionDetails = {
	ticker: string;
	name: string;
	description: string;
	collectionType: string;
	topics: string[];
	owner: string;
	isStampable: boolean;
};

export type CollectionAssets = {
	units: string;
};
