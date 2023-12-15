import React from 'react';
import { useActiveAddress } from 'arweave-wallet-kit';
import { useAtomicToolkit } from '~/stores';
import { Button } from 'antd';

interface Props {
	children: React.ReactNode;
}

const Wrapper = ({ children }: Props) => {
	const { atomicToolkit, setAtomicToolkit } = useAtomicToolkit();
	const activeAddress = useActiveAddress();
	if (atomicToolkit && activeAddress) {
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
