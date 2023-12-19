import React from 'react';
import { Button, Form } from 'antd';
import { useRouter } from 'next/router';
import { Discoverability } from '~/components/atomic-asset';

import { useCreateAtomicAsset } from '~/stores';

import * as Types from '~/types';

const BasicDetails = () => {
	const router = useRouter();
	const { discoverability, setDiscoverability } = useCreateAtomicAsset();
	const [form] = Form.useForm<Types.Discoverability>();

	const onFinish = (values: Types.Discoverability) => {
		setDiscoverability(values);
		router.push('/atomic-asset?step=initial-state');
	};

	return (
		<div className=''>
			<Form
				form={form}
				name='discoverability'
				onFinish={onFinish}
				scrollToFirstError
				initialValues={discoverability}
				size='large'
			>
				<Discoverability form={form} />
				<div className='my-8 flex justify-end'>
					<Button className='bg-primary' type='primary' htmlType='submit'>
						Next
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default BasicDetails;
