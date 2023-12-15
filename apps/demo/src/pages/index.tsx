import React from 'react';
import type { ReactElement } from 'react';
import { Layout } from '~/components';
import type { NextPageWithLayout } from './_app';

import { WebIrys } from '@irys/sdk';
import { WarpFactory } from 'warp-contracts';
import { AtomicToolkitWeb } from 'atomic-toolkit';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

// Hooks
import { useAtomicToolkit } from '~/stores';
import { useConnection } from 'arweave-wallet-kit';
import { useActiveAddress } from 'arweave-wallet-kit';

const Home: NextPageWithLayout = () => {
	const { atomicToolkit, setAtomicToolkit } = useAtomicToolkit();
	const { connected } = useConnection();
	const address = useActiveAddress();

	React.useEffect(() => {
		const get = async () => {
			const arconnect = window.arweaveWallet;
			const webIrys = new WebIrys({
				url: 'https://node2.irys.xyz',
				token: 'arweave',
				wallet: { provider: arconnect },
			});
			await webIrys.ready();
			const toolkit = new AtomicToolkitWeb({
				irys: webIrys,
				warp: WarpFactory.forTestnet().use(new DeployPlugin()),
			});
			return toolkit;
		};

		if (connected && address) {
			get().then((toolkit) => {
				console.log(toolkit);
				setAtomicToolkit(toolkit);
			});
		}
	}, [connected, address]);

	return (
		<div className='h-[500vh] w-full p-8'>
			<div className='mx-auto w-full max-w-screen-lg border-2'>aa</div>
		</div>
	);
};

Home.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Home;
