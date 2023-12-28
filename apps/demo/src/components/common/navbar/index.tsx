import React from 'react';
import Image from 'next/image';

import { AtomicToolkitWeb } from 'atomic-toolkit';
import ConnectButton from '../connect-button';

import { WebIrys } from '@irys/sdk';
import { providers } from 'ethers';

// Hooks
import { useAtomicToolkit } from '~/stores';
import { useAddress } from '@thirdweb-dev/react';
import { useConnection } from 'arweave-wallet-kit';

// Icons
import AtomicToolkitLogo from '~/assets/light.svg';

const Navbar = () => {
	const { setAtomicToolkit } = useAtomicToolkit();
	const { connected: arConnected } = useConnection();
	const ethAddress = useAddress();

	React.useEffect(() => {
		const getIrys = async () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			const provider = new providers.Web3Provider(window.ethereum);
			const wallet = { name: 'ethersv5', provider: provider };
			const url = 'https://node2.irys.xyz';
			const token = 'matic';
			const webIrys = new WebIrys({ url, token, wallet });

			await webIrys.ready();
			return webIrys;
		};

		const get = async () => {
			try {
				let toolkit: AtomicToolkitWeb;
				if (arConnected) {
					toolkit = new AtomicToolkitWeb({});
				} else {
					const irys = await getIrys();
					toolkit = new AtomicToolkitWeb({ irys });
				}
				setAtomicToolkit(toolkit);
			} catch (error) {
				console.log(error);
			}
		};

		if (arConnected || ethAddress !== undefined) {
			get();
		}
	}, [arConnected, ethAddress]);

	return (
		<div className='fixed z-[11] h-[8vh] w-full border-b-2 border-[#E5E7EB] bg-white p-4 px-6'>
			<div className='flex flex-row items-center justify-between'>
				<div className='flex flex-row items-center gap-2'>
					<Image
						src={AtomicToolkitLogo}
						alt='Atomic Toolkit Logo'
						width={225}
						height={100}
					/>
				</div>
				<ConnectButton />
			</div>
		</div>
	);
};

export default Navbar;
