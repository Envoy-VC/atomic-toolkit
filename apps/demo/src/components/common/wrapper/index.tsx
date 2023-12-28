import React from 'react';
import { useActiveAddress } from 'arweave-wallet-kit';
import { useAtomicToolkit } from '~/stores';
import { useAddress } from '@thirdweb-dev/react';

interface Props {
	children: React.ReactNode;
}

const Wrapper = ({ children }: Props) => {
	const { atomicToolkit } = useAtomicToolkit();
	const activeAddress = useActiveAddress();
	const ethAddress = useAddress();
	if (atomicToolkit && (activeAddress || ethAddress)) {
		return <>{children}</>;
	} else {
		return (
			<div className='w-full p-12 text-center text-xl font-medium'>
				Connect Wallet to start using Atomic Toolkit
			</div>
		);
	}
};

export default Wrapper;
