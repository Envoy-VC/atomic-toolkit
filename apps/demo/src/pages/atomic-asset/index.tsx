import React from 'react';
import type { ReactElement } from 'react';
import { Layout } from '~/components';
import type { NextPageWithLayout } from '../_app';

import { Wrapper } from '~/components/common';

import { useSearchParams, useRouter } from 'next/navigation';

import {
	BasicDetails,
	InitialState,
	LicenseDetails,
} from '~/sections/atomic-asset';

// Types
import { AssetFile } from '~/components/atomic-asset';

const AtomicAsset: NextPageWithLayout = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const step = searchParams.get('step');
	const hasStepParam = searchParams.has('step');

	React.useEffect(() => {
		if (!hasStepParam) {
			router.push('/atomic-asset?step=basic-details');
		}
	}, []);

	return (
		<Wrapper>
			<div className='mx-auto my-12 w-full p-8'>
				<div className='mb-16 text-2xl font-medium'>Create a Atomic Asset</div>

				<div className='flex flex-col gap-8 lg:flex-row'>
					<div className='w-full basis-1/2'>
						<AssetFile />
					</div>
					<div className='w-full basis-1/2'>
						{step === 'basic-details' && <BasicDetails />}
						{step === 'initial-state' && <InitialState />}
						{step === 'license-details' && <LicenseDetails />}
					</div>
				</div>
			</div>
		</Wrapper>
	);
};

AtomicAsset.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default AtomicAsset;
