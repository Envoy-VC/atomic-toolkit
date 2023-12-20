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

const initialState: State = {
	file: null,

	initialState: {
		ticker: '',
		name: '',
		balances: [],
	},
	discoverability: {
		indexWithUCM: true,
		type: '',
		title: '',
		description: '',
		topics: [],
	},
	license: {
		useDefaultLicense: true,
		license: 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8',
	},
};

export const useCreateAtomicAsset = create<State & Actions>((set) => ({
	...initialState,
	setFile: (file) => set({ file }),
	setInitialState: (initialState) => set({ initialState }),
	setDiscoverability: (discoverability) => set({ discoverability }),
	setLicense: (license) => set({ license }),
	reset: () => set(initialState),
}));
