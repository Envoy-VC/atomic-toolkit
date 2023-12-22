import React from 'react';
import { Form, Upload, InputNumber, Tooltip, UploadProps, Button } from 'antd';

import { useRouter } from 'next/router';

import { useCreateCollection } from '~/stores';

import { TbInfoCircle, TbInbox } from 'react-icons/tb';

// Types
import * as Types from '~/types';
import { AssetPreview } from '~/components/collection';

const CollectionAssetDetails = () => {
	const router = useRouter();
	const [form] = Form.useForm<Types.CollectionAssets>();

	const { files, assets, setAssets, setFiles, addFile } = useCreateCollection();

	const onFinish = (values: any) => {
		setAssets(values);
		router.push('/collection?step=license');
	};

	const onBack = () => {
		router.push('/collection?step=basic-details');
	};

	const props: UploadProps = {
		name: 'list',
		multiple: true,
		showUploadList: false,
		fileList: files,
		beforeUpload(file) {
			addFile(file);
			return false;
		},
		onRemove(file) {
			const index = files.indexOf(file);
			const newFileList = files.slice();
			newFileList.splice(index, 1);
			setFiles(newFileList);
		},
	};

	return (
		<div className='p-4'>
			<Form
				form={form}
				name='collection'
				onFinish={onFinish}
				scrollToFirstError
				initialValues={assets}
				size='large'
				className='max-w-xl'
			>
				<div className='flex flex-col gap-2'>
					<div className='flex flex-row items-center gap-2 text-[1rem] font-medium'>
						Total Units
						<Tooltip title='Set this to 1 so that an atomic assets can have only one owner.'>
							<TbInfoCircle className='text-gray-400' />
						</Tooltip>
					</div>

					<Form.Item
						name={['units']}
						rootClassName='my-0'
						rules={[{ required: true, message: 'Divisions Required' }]}
					>
						<InputNumber placeholder='100' className='w-full max-w-sm' />
					</Form.Item>

					<div className='text-[1rem] font-medium'>Atomic Assets</div>

					<Upload.Dragger {...props}>
						<p className='ant-upload-drag-icon'>
							<TbInbox className='mx-auto text-4xl' />
						</p>
						<p className='ant-upload-text'>
							Click or drag file to this area to upload
						</p>
						<p className='ant-upload-hint'>
							Support for a single or bulk upload. Strictly prohibited from uploading
							company data or other banned files.
						</p>
					</Upload.Dragger>

					<Button
						type='dashed'
						onClick={() => {
							setFiles([]);
							}}
					>
						Reset
					</Button>
					<div className='my-8 flex justify-between'>
						<Button type='dashed' onClick={onBack}>
							Back
						</Button>
						<Button className='bg-primary' type='primary' htmlType='submit'>
							Next
						</Button>
					</div>
				</div>
			</Form>
			{files?.length > 0 && (
				<>
					<div className='my-4 text-2xl font-medium'>Asset Preview</div>
					<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
						{files?.map((file, index) => {
							return <AssetPreview file={file} index={index} key={index} />;
						})}
					</div>
				</>
			)}
		</div>
	);
};

export default CollectionAssetDetails;
