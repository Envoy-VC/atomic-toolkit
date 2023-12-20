import React from 'react';
import { Form, FormInstance, Input, Select, Checkbox } from 'antd';

import { topics, types } from '~/helpers/constants';

import * as Types from '~/types';

interface Props {
	form: FormInstance<Types.Discoverability>;
}

const Discoverability = ({ form }: Props) => {
	const selectedTopics = Form.useWatch('topics', form);

	const filteredOptions = topics.filter(
		(t) => !selectedTopics?.includes(t.value)
	);

	return (
		<div className='flex flex-col gap-3 '>
			<span className='my-4 text-2xl font-medium uppercase'>
				Asset Discoverability
			</span>
			<div className='flex flex-col gap-2 rounded-xl'>
				<div className='text-[1rem] font-medium'>Type</div>
				<Form.Item
					name={['type']}
					rootClassName='my-0'
					rules={[{ required: true, message: 'Type required' }]}
				>
					<Select
						showSearch
						style={{ width: '100%' }}
						placeholder='Type of the asset. eg- image, video, document'
						options={types}
					/>
				</Form.Item>
				<div className='text-[1rem] font-medium'>Title</div>
				<Form.Item
					name={['title']}
					rootClassName='my-0'
					rules={[{ required: true, message: 'Title required' }]}
				>
					<Input placeholder='Title for the Atomic Asset' />
				</Form.Item>

				<div className='text-[1rem] font-medium'>Description</div>
				<Form.Item
					name={['description']}
					rootClassName='my-0'
					rules={[{ required: true, message: 'Description required' }]}
				>
					<Input.TextArea
						placeholder='Description for the Atomic Asset'
						rows={5}
						maxLength={300}
						showCount
					/>
				</Form.Item>
				<div className='text-[1rem] font-medium'>Topics</div>
				<Form.Item name={['topics']} rootClassName='my-0'>
					<Select
						mode='tags'
						style={{ width: '100%' }}
						placeholder='Topics for the Atomic Asset'
						options={filteredOptions.map((item) => ({
							value: item.label,
							label: item.value,
						}))}
					/>
				</Form.Item>
				<Form.Item
					name={['indexWithUCM']}
					rootClassName='my-0'
					valuePropName='checked'
				>
					<Checkbox>Index with UCM</Checkbox>
				</Form.Item>
			</div>
		</div>
	);
};

export default Discoverability;
