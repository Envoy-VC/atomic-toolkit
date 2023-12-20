import React from 'react';
import { UploadFile, Image } from 'antd';
import { RcFile } from 'antd/es/upload';

import { useCreateCollection } from '~/stores';

interface Props {
	file: UploadFile;
	index: number;
}

const AssetPreview = ({ file, index }: Props) => {
	const {
		collection: { name },
	} = useCreateCollection((state) => state);
	return (
		<div className='flex aspect-square flex-col gap-2 rounded-md border-[1px]'>
			<Image
				src={URL.createObjectURL(file as RcFile)}
				preview={false}
				fallback='https://rkmrajahmundry.org/wp-content/uploads/2020/04/default-placeholder.png'
				alt='asset'
				className='aspect-square w-full rounded-t-md object-cover'
			/>
			<div className='break-all p-2 text-lg font-medium'>{`${name} #${index}`}</div>
		</div>
	);
};

export default AssetPreview;
