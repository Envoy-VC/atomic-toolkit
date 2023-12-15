import React from 'react';
import Image from 'next/image';

import { ConnectButton } from 'arweave-wallet-kit';
import { WarpFactory } from 'warp-contracts';
import { AtomicToolkitWeb } from 'atomic-toolkit';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

// Hooks
import { useAtomicToolkit } from '~/stores';
import { useConnection } from 'arweave-wallet-kit';

// Icons
import AtomicToolkitLogo from '~/assets/light.svg';

const Navbar = () => {
	const { setAtomicToolkit } = useAtomicToolkit();
	const { connected } = useConnection();

	React.useEffect(() => {
		const get = async () => {
			const toolkit = new AtomicToolkitWeb({
				warp: WarpFactory.forTestnet().use(new DeployPlugin()),
				useIrys: false,
			});
			return toolkit;
		};

		if (connected) {
			get()
				.then((toolkit) => {
					console.log(toolkit);
					setAtomicToolkit(toolkit);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [connected]);

	return (
		<div className='fixed h-[8vh] w-full border-b-2 border-[#E5E7EB] bg-white p-4 px-6'>
			<div className='flex flex-row items-center justify-between'>
				<div className='flex flex-row items-center gap-2'>
					<Image
						src={AtomicToolkitLogo}
						alt='Atomic Toolkit Logo'
						width={225}
						height={100}
					/>
				</div>
				<ConnectButton
					showBalance
					showProfilePicture
					useAns
					profileModal
					accent='#fff'
					className='ConnectBtn !border-2 !border-black !p-1 !text-black'
				/>
			</div>
		</div>
	);
};

export default Navbar;
