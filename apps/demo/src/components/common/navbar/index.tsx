import React from 'react';
import Image from 'next/image';

import { ConnectButton } from 'arweave-wallet-kit';
import { AtomicToolkitWeb } from 'atomic-toolkit';

// @ts-ignore

// Hooks
import { useAtomicToolkit } from '~/stores';
import { useConnection } from 'arweave-wallet-kit';

// Icons
import AtomicToolkitLogo from '~/assets/light.svg';

const Navbar = () => {
	const { setAtomicToolkit } = useAtomicToolkit();
	const { connected } = useConnection();

	React.useEffect(() => {
		const get = () => {
			const toolkit = new AtomicToolkitWeb({});
			setAtomicToolkit(toolkit);
		};

		if (connected) {
			get();
		}
	}, [connected]);

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
				<ConnectButton
					showBalance={false}
					showProfilePicture={false}
					useAns
					profileModal
					accent='#fff'
					className='ConnectBtn !border-2 !border-black !p-0 !text-xs !text-black sm:!text-[1rem]'
				/>
			</div>
		</div>
	);
};

export default Navbar;
