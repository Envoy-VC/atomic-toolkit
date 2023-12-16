import React from 'react';
import { Form, Input, Select } from 'antd';

const Discoverability = () => {
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
					<Input placeholder='Type of the asset. eg- image, video, document' />
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
						options={topics}
					/>
				</Form.Item>
			</div>
		</div>
	);
};

const topics = [
	{
		label: 'Funny',
		value: 'Funny',
	},
	{
		label: 'Sports',
		value: 'Sports',
	},
	{
		label: 'Technology',
		value: 'Technology',
	},
	{
		label: 'Science',
		value: 'Science',
	},
	{
		label: 'Art',
		value: 'Art',
	},
	{
		label: 'Music',
		value: 'Music',
	},
	{
		label: 'Movies',
		value: 'Movies',
	},
	{
		label: 'Gaming',
		value: 'Gaming',
	},
	{
		label: 'Food',
		value: 'Food',
	},
	{
		label: 'Travel',
		value: 'Travel',
	},
	{
		label: 'Fitness',
		value: 'Fitness',
	},
	{
		label: 'Books',
		value: 'Books',
	},
	{
		label: 'Fashion',
		value: 'Fashion',
	},
	{
		label: 'History',
		value: 'History',
	},
	{
		label: 'Nature',
		value: 'Nature',
	},
	{
		label: 'Health',
		value: 'Health',
	},
	{
		label: 'Motivation',
		value: 'Motivation',
	},
	{
		label: 'Humor',
		value: 'Humor',
	},
	{
		label: 'Pets',
		value: 'Pets',
	},
	{
		label: 'Celebrities',
		value: 'Celebrities',
	},
	{
		label: 'Education',
		value: 'Education',
	},
];

export default Discoverability;
