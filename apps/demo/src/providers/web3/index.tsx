import React from 'react';
import { env } from '~/env.mjs';
import {
	ThirdwebProvider,
	metamaskWallet,
	coinbaseWallet,
	walletConnect,
} from '@thirdweb-dev/react';

import { Mumbai } from '@thirdweb-dev/chains';

interface Props {
	children: React.ReactNode;
}

const Web3Provider = ({ children }: Props) => {
	return (
		<ThirdwebProvider
			activeChain={Mumbai}
			clientId={env.NEXT_PUBLIC_TW_ID}
			supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()]}
			dAppMeta={{
				name: 'Atomic Toolkit Demo',
				description: 'Atomic Toolkit Demo',
				logoUrl:
					'https://atomic-toolkit-demo.vercel.app/android-chrome-512x512.png',
				url: 'https://atomic-toolkit-demo.vercel.app/',
				isDarkMode: true,
			}}
			theme='light'
		>
			{children}
		</ThirdwebProvider>
	);
};

export default Web3Provider;
