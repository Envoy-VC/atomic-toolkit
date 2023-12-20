import React from 'react';
import type { ReactElement } from 'react';
import { Layout } from '~/components';
import type { NextPageWithLayout } from '../_app';

import { Form } from 'antd';

import { useSearchParams, useRouter } from 'next/navigation';

import { useCreateCollection } from '~/stores';

import {
	CollectionDetails,
	CollectionAssetDetails,
	CollectionLicense,
} from '~/sections/collection';

import { Wrapper } from '~/components/common';
import { CollectionAssets } from '~/components/collection';

// Types
import * as Types from '~/types';

const AtomicAsset: NextPageWithLayout = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const step = searchParams.get('step');
	const hasStepParam = searchParams.has('step');

	const { collection, setCollection } = useCreateCollection();

	React.useEffect(() => {
		if (!hasStepParam) {
			router.push('/collection?step=basic-details');
		}
	}, []);

	const [collectionDetailsForm] = Form.useForm<Types.CollectionDetails>();

	const onFinish = (values: Types.CollectionDetails) => {
		setCollection(values);
		router.push('/collection?step=assets');
	};

	return (
		<Wrapper>
			<div className='mx-auto mb-12 w-full pb-8'>
				<Form
					form={collectionDetailsForm}
					name='collection'
					onFinish={onFinish}
					scrollToFirstError
					initialValues={collection}
					size='large'
				>
					<CollectionAssets form={collectionDetailsForm} />
					{step === 'basic-details' && (
						<CollectionDetails form={collectionDetailsForm} />
					)}
				</Form>
				{step === 'assets' && <CollectionAssetDetails />}
				{step === 'license' && <CollectionLicense />}
			</div>
		</Wrapper>
	);
};

AtomicAsset.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default AtomicAsset;
