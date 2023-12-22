import React from 'react';
import toast from 'react-hot-toast';
import { Button, Form, Modal } from 'antd';
import { useRouter } from 'next/router';

import Confetti from 'react-confetti';

import { useCreateCollection, useAtomicToolkit } from '~/stores';

import { CollectionLicenseForm } from '~/components/collection';

import { buildCollectionOpts } from '~/helpers';

import { CgSpinner } from 'react-icons/cg';

import * as Types from '~/types';

export interface ContractDeploy {
	contractTxId: string;
	srcTxId?: string;
}

const CollectionLicense = () => {
	const router = useRouter();
	const [form] = Form.useForm<Types.License>();

	const { atomicToolkit } = useAtomicToolkit();

	const {
		files,
		thumbnail,
		banner,
		collection,
		assets,
		license,
		reset,
		setLicense,
		setFiles,
		setBanner,
		setThumbnail,
	} = useCreateCollection();

	const [isCreating, setIsCreating] = React.useState<boolean>(false);
	const [modalOpen, setModalOpen] = React.useState<boolean>(false);
	const [progress, setProgress] = React.useState<string>('idle');
	const [txId, setTxId] = React.useState<string>('');

	const handleOk = () => {
		setTxId('');
		setFiles([]);
		setBanner(null);
		setThumbnail(null);
		reset();
		setModalOpen(false);
		router.push('/collection?step=basic-details');
	};

	const callback = (progress: string) => {
		setProgress(progress);
	};

	const onFinish = async (values: Types.License) => {
		try {
			if (!atomicToolkit) {
				throw new Error('Atomic Toolkit is not initialized');
			}

			if (!thumbnail || !banner) {
				toast.error('Thumbnail and Banner are required');
				throw new Error('Thumbnail and Banner are required');
			}
			setIsCreating(true);
			setLicense(values);
			setModalOpen(true);

			const opts = buildCollectionOpts({
				collection,
				license: values,
				assets,
				thumbnail,
				banner,
				files,
			});
			console.log(opts);
			const { mutateAsync } = await atomicToolkit.collection.createCollection(
				callback,
				opts
			);
			const tx = await mutateAsync();
			setTxId(tx.id);
			toast.success('Successfully Created');
		} catch (error) {
			setModalOpen(false);
			console.log(error);
			toast.error(String(error));
		} finally {
			setIsCreating(false);
		}
	};

	const onBack = () => {
		router.push('/collection?step=assets');
	};

	return (
		<div className=''>
			<Form
				form={form}
				name='license-form'
				onFinish={onFinish}
				scrollToFirstError
				initialValues={license}
				size='large'
				className='max-w-xl p-4'
			>
				<CollectionLicenseForm form={form} />
				<div className='my-8 flex justify-between'>
					<Button type='dashed' onClick={onBack} disabled={isCreating}>
						Back
					</Button>
					<Button
						className='bg-primary'
						type='primary'
						htmlType='submit'
						disabled={isCreating}
					>
						{isCreating ? (
							<CgSpinner className='animate-spin text-lg' />
						) : (
							'Create Collection'
						)}
					</Button>
				</div>
				<SuccessModal
					isModalOpen={modalOpen}
					handleOk={handleOk}
					txId={txId}
					progress={progress}
				/>
			</Form>
		</div>
	);
};

interface ModalProps {
	isModalOpen: boolean;
	handleOk: () => void;
	progress: string;
	txId: string;
}

const SuccessModal = ({
	isModalOpen,
	txId,
	handleOk,
	progress,
}: ModalProps) => {
	const [isExploding, setIsExploding] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (txId === '') return;
		setIsExploding(true);
		setTimeout(() => {
			setIsExploding(false);
		}, 5000);
	}, [txId]);

	return (
		<div>
			<Modal
				title={txId === '' ? 'Creating Collection...' : ' 🐘 Collection Created'}
				open={isModalOpen}
				onOk={handleOk}
				footer={null}
				styles={{
					mask: {
						backgroundColor: 'rgba(0, 0, 0, 0.35)',
					},
				}}
			>
				<div className='p-2'>
					{txId !== '' ? (
						<>
							<div className='flex flex-col gap-2 text-[1rem]'>
								Collection ID: <span className='font-medium text-primary'>{txId}</span>
							</div>
							<div className='my-6 flex justify-end'>
								<Button
									className='bg-primary'
									type='primary'
									onClick={handleOk}
									size='middle'
								>
									Done
								</Button>
							</div>
						</>
					) : (
						<div className='flex flex-row items-center justify-center gap-2 p-8 text-[1rem]'>
							<CgSpinner className='animate-spin text-xl' />
							<div>
								{progress === 'idle' && 'Initializing...'}
								{progress === 'uploading-thumbnail' && 'Uploading Thumbnail'}
								{progress === 'uploading-banner' && 'Uploading Banner'}
								{progress.startsWith('uploading-asset') &&
									`Uploading Asset ${
										progress.split('-')[progress.split('-').length - 1]
									}`}
								{progress === 'creating-collection' && 'Creating Collection'}
								{progress === 'success' && 'Finalizing...'}
							</div>
						</div>
					)}
				</div>
			</Modal>
			{isExploding && txId !== '' && (
				<Confetti recycle={isExploding} numberOfPieces={100} />
			)}
		</div>
	);
};

export default CollectionLicense;
