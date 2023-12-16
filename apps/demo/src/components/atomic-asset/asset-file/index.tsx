import React from 'react';
import { Skeleton } from 'antd';

import { Upload, Button, Image } from 'antd';

// Stores
import { useCreateAtomicAsset } from '~/stores';

// Types
import type { UploadProps } from 'antd';

// Icons
import { TbUpload } from 'react-icons/tb';

const AssetFile = () => {
	const { file, setFile } = useCreateAtomicAsset((state) => state);
	const [previewURL, setPreviewURL] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (file === null) {
			setPreviewURL(null);
		}
	}, [file]);

	const props: UploadProps = {
		name: 'file',
		multiple: false,
		showUploadList: true,
		fileList: file ? [file] : [],
		beforeUpload(file) {
			setFile(file);
			const previewURL = URL.createObjectURL(file);
			setPreviewURL(previewURL);
			return false;
		},

		onRemove() {
			setFile(null);
			setPreviewURL(null);
		},
	};

	const normFile = (e: any) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList;
	};

	return (
		<div className='flex flex-col items-center justify-center'>
			{previewURL ? (
				<Image
					src={previewURL}
					preview={false}
					className='mb-4 aspect-square h-full w-full max-w-xl rounded-xl'
				/>
			) : (
				<Skeleton.Image className='!mb-4 !aspect-square !h-full !w-full !max-w-xl !rounded-xl' />
			)}

			<Upload {...props}>
				<Button icon={<TbUpload />}>Click to Upload</Button>
			</Upload>
		</div>
	);
};

export default AssetFile;
