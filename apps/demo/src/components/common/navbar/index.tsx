import React from 'react';
import Image from 'next/image';

// Icons
import AtomicToolkitLogo from '~/assets/light.svg';

const Navbar = () => {
	return (
		<div className='p-4 px-6'>
			<div className='flex flex-row items-center justify-between'>
				<div className='flex flex-row items-center gap-2'>
					<Image
						src={AtomicToolkitLogo}
						alt='Atomic Toolkit Logo'
						width={225}
						height={100}
					/>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
