import React from 'react';
import Image from 'next/image';

import { ConnectButton } from 'arweave-wallet-kit';

// Icons
import AtomicToolkitLogo from '~/assets/light.svg';

const Navbar = () => {
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
				<ConnectButton showBalance showProfilePicture useAns profileModal />
			</div>
		</div>
	);
};

export default Navbar;
