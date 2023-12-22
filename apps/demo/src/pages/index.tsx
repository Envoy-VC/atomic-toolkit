import React from 'react';
import type { ReactElement } from 'react';
import { Layout } from '~/components';
import type { NextPageWithLayout } from './_app';

import { useAtomicToolkit } from '~/stores';

const Home: NextPageWithLayout = () => {
	const { atomicToolkit } = useAtomicToolkit();

	return (
		<div className='w-full p-8'>
			<div className='mx-auto w-full max-w-screen-lg'></div>
		</div>
	);
};

Home.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Home;
