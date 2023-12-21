import React from 'react';
import toast from 'react-hot-toast';
import { Button, Form, Modal } from 'antd';
import { useRouter } from 'next/router';

import Confetti from 'react-confetti';
import { RcFile } from 'antd/es/upload';

import { useCreateCollection, useAtomicToolkit } from '~/stores';

import { CollectionLicenseForm } from '~/components/collection';

import { buildCollectionOpts, buildLicenseOpts } from '~/helpers';

import { CgSpinner } from 'react-icons/cg';

import * as Types from '~/types';
import { CreateTradableAssetOpts } from 'atomic-toolkit';

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
	} = useCreateCollection();

	const [isCreating, setIsCreating] = React.useState<boolean>(false);
	const [modalOpen, setModalOpen] = React.useState<boolean>(false);
	const [txId, setTxId] = React.useState<string>('');

	const handleOk = () => {
		setModalOpen(false);
		setTxId('');
		reset();
		router.push('/collection?step=basic-details');
	};

	const getAtomicOpts = (
		license: Types.License,
		collection: Types.CollectionDetails,
		index: number,
		units: string,
		type: string
	) => {
		const licenseOpts = buildLicenseOpts(license);
		const opts: CreateTradableAssetOpts = {
			initialState: {
				name: `${collection.name} #${index}`,
				ticker: collection.ticker,
				balances: {
					[collection.owner]: parseInt(units),
				},
				claimable: [],
			},
			discoverability: {
				type: type,
				title: `${collection.name} #${index}`,
				description: collection.description,
				topics: collection.topics,
			},
			license: licenseOpts,
			indexWithUCM: false,
		};
		return opts;
	};

	const onFinish = async (values: Types.License) => {
		try {
			if (!atomicToolkit) {
				throw new Error('Atomic Toolkit is not initialized');
			}
			setIsCreating(true);
			setLicense(values);
			setModalOpen(true);

			const promises = files.map((file, index) => {
				const type =
					(
						file?.type ??
						file?.originFileObj?.type ??
						'application/octet-stream'
					).split('/')[0] ?? 'asset';

				const opts = getAtomicOpts(values, collection, index, assets.units, type);
				return atomicToolkit.assets.createAtomicAsset(file as RcFile, opts);
			});

			const txns = await Promise.all(promises);
			const assetIds: string[] = [];
			txns.forEach((txn) => {
				assetIds.push(txn.contractTxId);
			});
			const opts = buildCollectionOpts({
				collection,
				license,
				assets,
				thumbnail,
				banner,
				assetIds,
				files,
			});
			const tx = await atomicToolkit.collection.createCollectionWithAssetIds(opts);
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
				<SuccessModal isModalOpen={modalOpen} handleOk={handleOk} txId={txId} />
			</Form>
		</div>
	);
};

interface ModalProps {
	isModalOpen: boolean;
	handleOk: () => void;
	txId: string;
}

const SuccessModal = ({ isModalOpen, txId, handleOk }: ModalProps) => {
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
							<div>Creating Collection...</div>
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
