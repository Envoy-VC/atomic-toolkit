import React from 'react';
import { Form, FormInstance, Input, InputNumber, Select, Checkbox } from 'antd';

import * as Types from '~/types';
interface Props {
	form: FormInstance<Types.License>;
}

const License = ({ form }: Props) => {
	const useDefaultLicense = Form.useWatch('useDefaultLicense', form);
	return (
		<div className='flex flex-col gap-3'>
			<span className='text-2xl font-medium uppercase'>License Details</span>
			<Form.Item
				name={['useDefaultLicense']}
				rootClassName='my-0'
				valuePropName='checked'
			>
				<Checkbox>Use Default License values</Checkbox>
			</Form.Item>
			{!useDefaultLicense && (
				<div className='flex flex-col gap-2 rounded-xl'>
					<Form.Item
						name={['license']}
						rootClassName='my-0'
						rules={[{ required: true, message: 'License required' }]}
					>
						<Select
							style={{ width: '100%' }}
							placeholder='License for the Atomic Asset'
							options={[
								{
									label: 'Universal Data License',
									value: 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8',
								},
							]}
						/>
					</Form.Item>
					<div className='text-[1rem] font-medium'>License Fee</div>
					<div className='flex flex-row gap-2'>
						<Form.Item name={['feeType']} rootClassName='my-0 w-full max-w-md'>
							<Select
								style={{ width: '100%' }}
								placeholder='Fee Type'
								options={FeeOptions}
								className='w-full'
							/>
						</Form.Item>
						<Form.Item name={['fee']} rootClassName='my-0 w-full max-w-xs'>
							<InputNumber placeholder='Amount' className='w-full' />
						</Form.Item>
					</div>
					<div className='text-[1rem] font-medium'>Commercial Use</div>
					<Form.Item name={['commercialUse']} rootClassName='my-0'>
						<Select
							style={{ width: '100%' }}
							placeholder='Commercial Use'
							options={CommercialUseOptions}
						/>
					</Form.Item>
					<div className='text-[1rem] font-medium'>Currency</div>
					<Form.Item name={['currency']} rootClassName='my-0'>
						<Select
							style={{ width: '100%' }}
							placeholder='Currency'
							options={CurrencyOptions}
							className='w-full'
						/>
					</Form.Item>
					<div className='text-[1rem] font-medium'>Derivation</div>
					<Form.Item name={['derivation']} rootClassName='my-0'>
						<Select
							style={{ width: '100%' }}
							placeholder='Derivation'
							options={DerivationOptions}
							className='w-full'
						/>
					</Form.Item>
					<div className='text-[1rem] font-medium'>Payment Address</div>
					<Form.Item name={['paymentAddress']} rootClassName='my-0'>
						<Input placeholder='Payment Address' />
					</Form.Item>
				</div>
			)}
		</div>
	);
};

const FeeOptions = [
	{
		label: 'None',
		value: 'None',
	},
	{
		label: 'One Time',
		value: 'One-Time',
	},
	{
		label: 'Monthly',
		value: 'Monthly',
	},
];

const CommercialUseOptions = [
	{
		label: 'None',
		value: 'None',
	},
	{
		label: 'Allowed',
		value: 'Allowed',
	},
	{
		label: 'Allowed With Credit',
		value: 'Allowed-With-Credit',
	},
];

const CurrencyOptions = [
	{
		label: 'U',
		value: 'U',
	},
	{
		label: 'Arweave',
		value: 'AR',
	},
	{
		label: 'Ethereum',
		value: 'ETH',
	},
	{
		label: 'Solana',
		value: 'SOL',
	},
	{
		label: 'Matic',
		value: 'MATIC',
	},
];

const DerivationOptions = [
	{
		label: 'None',
		value: 'None',
	},
	{
		label: 'Allowed With Credit',
		value: 'Allowed-With-Credit',
	},
	{
		label: 'Allowed With Indication',
		value: 'Allowed-With-Indication',
	},
	{
		label: 'Allowed With License Passthrough',
		value: 'Allowed-With-License-Passthrough',
	},
	{
		label: 'Allowed With Revenue Share 25%',
		value: 'Allowed-With-RevenueShare-25%',
	},
	{
		label: 'Allowed With Revenue Share 50%',
		value: 'Allowed-With-RevenueShare-50%',
	},
	{
		label: 'Allowed With Revenue Share 75%',
		value: 'Allowed-With-RevenueShare-75%',
	},
	{
		label: 'Allowed With Revenue Share 100%',
		value: 'Allowed-With-RevenueShare-100%',
	},
];

export default License;
