export type InitialState = {
	ticker: string;
	name: string;
	balances: { address: string; balance: number }[];
};

export type Discoverability = {
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
