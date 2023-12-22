import { create } from 'zustand';
import { UploadFile } from 'antd';

import { CollectionDetails, CollectionAssets, License } from '~/types';

export interface State {
	banner: UploadFile | null;
	thumbnail: UploadFile | null;
	collection: CollectionDetails;
	assets: CollectionAssets;
	files: UploadFile[];
	license: License;
}

interface Actions {
	setBanner: (banner: UploadFile | null) => void;
	setThumbnail: (thumbnail: UploadFile | null) => void;
	setCollection: (collection: CollectionDetails) => void;
	setAssets: (assets: CollectionAssets) => void;
	setLicense: (license: License) => void;
	setFiles: (files: UploadFile[]) => void;
	addFile: (file: UploadFile) => void;
	reset: () => void;
}

const initialState: State = {
	banner: null,
	thumbnail: null,
	collection: {
		ticker: '',
		name: '',
		description: '',
		topics: [],
		owner: '',
		collectionType: '',
		isStampable: true,
	},
	assets: {
		units: '',
	},
	files: [],
	license: {
		useDefaultLicense: true,
		license: 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8',
	},
};

export const useCreateCollection = create<State & Actions>((set) => ({
	...initialState,
	setBanner: (banner) => set({ banner }),
	setThumbnail: (thumbnail) => set({ thumbnail }),
	setCollection: (collection) => set({ collection }),
	setAssets: (assets) => set({ assets }),
	setLicense: (license) => set({ license }),
	addFile: (file) => set((state) => ({ files: [...state.files, file] })),
	setFiles: (files) => set({ files }),
	reset: () => set(initialState),
}));
