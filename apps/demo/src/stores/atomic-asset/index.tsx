import { create } from 'zustand';
import { UploadFile } from 'antd';

import { InitialState, Discoverability, License } from '~/types';

interface State {
	file: UploadFile | null;
	initialState: InitialState;
	discoverability: Discoverability;
	license: License;
}

interface Actions {
	setFile: (file: UploadFile | null) => void;
	setInitialState: (initialState: InitialState) => void;
	setDiscoverability: (discoverability: Discoverability) => void;
	setLicense: (license: License) => void;
	reset: () => void;
}

export const useCreateAtomicAsset = create<State & Actions>((set) => ({
	file: null,
	initialState: {
		ticker: '',
		name: '',
		balances: [],
	},
	discoverability: {
		type: '',
		title: '',
		description: '',
		topics: [],
	},
	license: {
		license: '',
	},
	setFile: (file) => set({ file }),
	setInitialState: (initialState) => set({ initialState }),
	setDiscoverability: (discoverability) => set({ discoverability }),
	setLicense: (license) => set({ license }),
	reset: () =>
		set({
			file: null,
			initialState: {
				ticker: '',
				name: '',
				balances: [],
			},
			discoverability: {
				type: '',
				title: '',
				description: '',
				topics: [],
			},
			license: {
				license: '',
				feeType: '',
				fee: 0,
				commercialUse: '',
				currency: '',
				derivation: '',
				paymentAddress: '',
			},
		}),
}));
