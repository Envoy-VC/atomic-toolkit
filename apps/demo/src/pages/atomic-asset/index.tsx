import React from 'react';
import type { ReactElement } from 'react';
import { Layout } from '~/components';
import type { NextPageWithLayout } from '../_app';
import { Wrapper } from '~/components/common';
import { useAtomicToolkit } from '~/stores';

const AtomicAsset: NextPageWithLayout = () => {
	return (
		<Wrapper>
			<div className='w-full p-8'>
				<div className='mx-auto w-full'>aa</div>
			</div>
		</Wrapper>
	);
};

AtomicAsset.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default AtomicAsset;
