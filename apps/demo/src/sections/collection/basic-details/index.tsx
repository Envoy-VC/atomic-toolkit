import React from 'react';
import { Input, Form, Button, Select, FormInstance, Checkbox } from 'antd';

import { topics ,collectionTypes} from '~/helpers/constants';

import * as Types from '~/types';

interface Props {
	form: FormInstance<Types.CollectionDetails>;
}

const CollectionDetails = ({ form }: Props) => {
	const selectedTopics = Form.useWatch('topics', form);

	const filteredOptions = topics.filter(
		(t) => !selectedTopics?.includes(t.value)
	);

	return (
		<div className='px-4'>
			<div className='my-8 flex w-full max-w-xl flex-col gap-2'>
				<div className='text-[1rem] font-medium'>Ticker</div>
				<Form.Item
					name={['ticker']}
					rootClassName='my-0'
					rules={[{ required: true, message: 'Ticker required' }]}
				>
					<Input placeholder='eg- ATOMIC' className='max-w-xs' />
				</Form.Item>

				<div className='text-[1rem] font-medium'>Name</div>
				<Form.Item
					name={['name']}
					rootClassName='my-0'
					rules={[{ required: true, message: 'Name required' }]}
				>
					<Input placeholder='eg- Aeternum Pachyderm' />
				</Form.Item>

				<div className='text-[1rem] font-medium'>Description</div>
				<Form.Item
					name={['description']}
					rootClassName='my-0'
					rules={[{ required: true, message: 'Description required' }]}
				>
					<Input.TextArea
						placeholder='Creare pulchritudinem aeternam in singulis minutis. Hic collectio elephantem ut symbolum firmitatis et aeternitatis describit, tactu artificio quod numquam abibit tempore.'
						maxLength={300}
						showCount
						rows={6}
					/>
				</Form.Item>

				<div className='text-[1rem] font-medium'>Collection Type</div>
				<Form.Item
					name={['collectionType']}
					rootClassName='my-0'
					rules={[{ required: true, message: 'Type required' }]}
				>
					<Select
						showSearch
						style={{ width: '100%' }}
						placeholder='Type of the asset. eg- image, video, document'
						options={collectionTypes}
					/>
				</Form.Item>

				<div className='text-[1rem] font-medium'>Owner</div>
				<Form.Item
					name={['owner']}
					rootClassName='my-0'
					rules={[
						{ required: true, message: 'Owner required' },
						{
							pattern: /[a-z0-9-_]{43}/i,
							message: 'Invalid address',
						},
					]}
				>
					<Input placeholder='9WQ7xH2LOuqfAccjGquck8eaKARg1vMhRJaOo3LJL14' />
				</Form.Item>

				<div className='text-[1rem] font-medium'>Topics</div>
				<Form.Item name={['topics']} rootClassName='my-0'>
					<Select
						mode='tags'
						style={{ width: '100%' }}
						placeholder='Topics for the Collection'
						options={filteredOptions.map((item) => ({
							value: item.label,
							label: item.value,
						}))}
					/>
				</Form.Item>
				<Form.Item
					name={['isStampable']}
					rootClassName='my-0'
					valuePropName='checked'
				>
					<Checkbox>Allow Collection to be Stampable</Checkbox>
				</Form.Item>

				<Button className='my-4 w-fit bg-primary' type='primary' htmlType='submit'>
					Next
				</Button>
			</div>
		</div>
	);
};

export default CollectionDetails;
