import React from 'react';
import { Button, Form } from 'antd';
import { useRouter } from 'next/router';

import { useCreateAtomicAsset } from '~/stores';

import { InitialState as InitialStateForm } from '~/components/atomic-asset';

import * as Types from '~/types';

const InitialState = () => {
	const router = useRouter();
	const { initialState, setInitialState } = useCreateAtomicAsset();
	const [form] = Form.useForm<Types.InitialState>();

	const onFinish = (values: Types.InitialState) => {
		setInitialState(values);
		router.push('/atomic-asset?step=license-details');
	};

	const onBack = () => {
		router.push('/atomic-asset?step=basic-details');
	};

	return (
		<div className=''>
			<Form
				form={form}
				name='initialState'
				onFinish={onFinish}
				scrollToFirstError
				initialValues={initialState}
				size='large'
			>
				<InitialStateForm />
				<div className='my-8 flex justify-between'>
					<Button type='dashed' onClick={onBack}>
						Back
					</Button>
					<Button className='bg-primary' type='primary' htmlType='submit'>
						Next
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default InitialState;
