import React from 'react';
import { Form, Input, Space, Button, InputNumber } from 'antd';

import { HiMiniTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const InitialState = () => {
	return (
		<div className='flex flex-col gap-3 '>
			<span className='my-4 text-2xl font-medium uppercase'>Initial State</span>
			<div className='flex flex-col gap-2'>
				<div className='text-[1rem] font-medium'>Ticker</div>
				<Form.Item
					name={['ticker']}
					rootClassName='my-0'
					rules={[{ required: true, message: 'Ticker required' }]}
				>
					<Input placeholder='Ticker for the Asset. eg- ATOMIC' />
				</Form.Item>
				<div className='text-[1rem] font-medium'>Name</div>
				<Form.Item
					name={['name']}
					rules={[{ required: true, message: 'Name required' }]}
				>
					<Input placeholder='Name for the Atomic Asset' />
				</Form.Item>
				<div className='text-[1rem] font-medium'>Balances</div>
				<Form.List
					name={['balances']}
					rules={[
						{
							validator: async (_, balances) => {
								if (!balances || balances.length < 1) {
									toast.error('At least one owner is required');
									return Promise.reject(new Error('At least one owner is required'));
								}
								return Promise.resolve();
							},
						},
					]}
				>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<div key={key} className='flex w-full items-start gap-2'>
									<Form.Item
										{...restField}
										name={[name, 'address']}
										rules={[
											{ required: true, message: 'Address required' },
											{
												pattern: /[a-z0-9-_]{43}/i,
												message: 'Invalid address',
											},
										]}
										rootClassName='my-0 max-w-md w-full'
									>
										<Input placeholder='Address' className='w-full max-w-md' />
									</Form.Item>
									<Form.Item
										{...restField}
										name={[name, 'balance']}
										rules={[
											{
												required: true,
												message: 'Balance required',
												type: 'number',
											},
										]}
										rootClassName='my-0 max-w-xs'
									>
										<InputNumber placeholder='Balance' className='w-full' />
									</Form.Item>
									<Button
										type='text'
										className='flex !w-fit flex-row items-center justify-center'
										onClick={() => remove(name)}
									>
										<HiMiniTrash className='text-lg text-red-500' />
									</Button>
								</div>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} block>
									Add Owner
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</div>
		</div>
	);
};

export default InitialState;
