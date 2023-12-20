import React from 'react';
import { Form, Skeleton } from 'antd';

import { Upload, Button, Image } from 'antd';

// Stores
import { useCreateCollection } from '~/stores';

// Types
import type { FormInstance, UploadFile, UploadProps } from 'antd';

// Icons
import { TbUpload, TbTrash } from 'react-icons/tb';

import * as Types from '~/types';

interface Props {
	form: FormInstance<Types.CollectionDetails>;
}

const CollectionAssets = ({ form }: Props) => {
	const collectionName = Form.useWatch('name', form);
	const collectionDesc = Form.useWatch('description', form);

	const { banner, thumbnail, setBanner, setThumbnail } = useCreateCollection(
		(state) => state
	);
	const [bannerPreview, setBannerPreview] = React.useState<string | null>(null);
	const [thumbPreview, setThumbPreview] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (banner === null) {
			setBannerPreview(null);
		}
	}, [banner]);

	React.useEffect(() => {
		if (thumbPreview === null) {
			setThumbPreview(null);
		}
	}, [thumbPreview]);

	const uploadProps = ({
		asset,
		setFile,
		setPreview,
	}: {
		asset: UploadFile | null;
		setFile: (file: UploadFile | null) => void;
		setPreview: React.Dispatch<React.SetStateAction<string | null>>;
	}) => {
		return {
			name: 'file',
			multiple: false,
			showUploadList: true,
			fileList: asset ? [asset] : [],
			accept: 'image/*',
			beforeUpload(file) {
				setFile(file);
				const previewURL = URL.createObjectURL(file);
				setPreview(previewURL);
				return false;
			},

			onRemove() {
				setFile(null);
				setPreview(null);
			},
		} as UploadProps;
	};

	const onRemove = (file: 'banner' | 'thumbnail') => {
		if (file === 'banner') {
			setBanner(null);
			setBannerPreview(null);
		} else {
			setThumbnail(null);
			setThumbPreview(null);
		}
	};

	return (
		<div className='flex flex-col rounded-md border-[1px] border-[#D1D1D1] md:m-3 md:flex-row'>
			<div className='order-2 w-full basis-1/2 md:order-1'>
				<div className='flex h-full flex-col justify-center gap-3 p-4'>
					<div>
						{thumbPreview ? (
							<div className='flex w-full'>
								<div className='relative w-full max-w-xs'>
									<Button
										size='small'
										icon={<TbTrash className='text-sm' />}
										className='absolute right-[75%] z-[10] -mx-4 bg-white'
										onClick={() => onRemove('thumbnail')}
									/>

									<Image
										src={thumbPreview}
										preview={false}
										className='aspect-square h-full w-full max-w-[6rem] rounded-xl object-cover'
									/>
								</div>
							</div>
						) : (
							<div className='relative flex w-full'>
								<Upload
									{...uploadProps({
										asset: thumbnail,
										setFile: setThumbnail,
										setPreview: setThumbPreview,
									})}
									className='absolute top-1/2 flex -translate-y-1/2 left-0 translate-x-2/3 items-center justify-center'
								>
									<Button icon={<TbUpload />} className=' bg-white' />
								</Upload>
								<Skeleton.Button className='!aspect-square !h-full !w-full !max-w-[6rem] !rounded-xl' />
							</div>
						)}
					</div>
					<div className='text-3xl font-semibold'>
						{!collectionName ? 'Collection Name' : collectionName}
					</div>
					<p className='whitespace-pre-wrap break-all'>
						{!collectionDesc
							? 'lorem ipsum dollar emmet sit amet erat mag et dolor lore mauris lore m nibh euismod ? Lore m nib'
							: collectionDesc}
					</p>
				</div>
			</div>
			<div className='order-1 w-full basis-1/2 md:order-2'>
				{bannerPreview ? (
					<div className='relative flex'>
						<div className='absolute w-full'>
							<Button
								icon={<TbTrash className='text-xl' />}
								className='left-[100%] top-0 z-[10] -mx-4 my-4 -translate-x-[100%] bg-white'
								onClick={() => onRemove('banner')}
							/>
						</div>
						<Image
							src={bannerPreview}
							preview={false}
							className='aspect-video h-full w-full max-w-3xl rounded-md object-cover'
						/>
					</div>
				) : (
					<div className='relative w-full'>
						<Upload
							{...uploadProps({
								asset: banner,
								setFile: setBanner,
								setPreview: setBannerPreview,
							})}
							className='absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2'
						>
							<Button icon={<TbUpload />} className='!bg-white'>
								Collection Banner (1600 x 600px)
							</Button>
						</Upload>
						<Skeleton.Button className='!aspect-video !h-full !w-full !max-w-3xl !rounded-md' />
					</div>
				)}
			</div>
		</div>
	);
};

export default CollectionAssets;
