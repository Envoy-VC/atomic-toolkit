import { create } from 'zustand';
import { AtomicToolkitWeb } from 'atomic-toolkit';

interface State {
	atomicToolkit: AtomicToolkitWeb | null;
}

interface Actions {
	setAtomicToolkit: (atomicToolkit: AtomicToolkitWeb) => void;
}

export const useAtomicToolkit = create<State & Actions>()((set) => ({
	atomicToolkit: null,
	setAtomicToolkit: (atomicToolkit) => set({ atomicToolkit }),
}));
