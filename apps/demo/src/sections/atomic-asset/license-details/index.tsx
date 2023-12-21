import React from 'react';
import toast from 'react-hot-toast';
import { Button, Form, Modal } from 'antd';
import { useRouter } from 'next/router';

import Confetti from 'react-confetti';

import { useCreateAtomicAsset, useAtomicToolkit } from '~/stores';

import { License as LicenseForm } from '~/components/atomic-asset';

import { buildOptions } from '~/helpers';

import { CgSpinner } from 'react-icons/cg';

import * as Types from '~/types';
import { RcFile } from 'antd/es/upload';

const LicenseDetails = () => {
	const router = useRouter();
	const [form] = Form.useForm<Types.License>();

	const { atomicToolkit } = useAtomicToolkit();

	const { file, discoverability, initialState, license, setLicense, reset } =
		useCreateAtomicAsset();

	const [isCreating, setIsCreating] = React.useState<boolean>(false);
	const [modalOpen, setModalOpen] = React.useState<boolean>(false);
	const [txId, setTxId] = React.useState<string>('');

	const handleOk = () => {
		setModalOpen(false);
		setTxId('');
		reset();
		router.push('/atomic-asset?step=basic-details');
	};

	const onFinish = async (values: Types.License) => {
		try {
			setIsCreating(true);
			setLicense(values);
			if (!atomicToolkit) {
				toast.error('Atomic Toolkit is not initialized');
				return;
			}
			if (!file) {
				toast.error('Asset file is required');
				return;
			}
			const opts = buildOptions({
				discoverability,
				initialState,
				license: values,
			});

			setModalOpen(true);

			const tx = await atomicToolkit.assets.createAtomicAsset(
				file as RcFile,
				opts
			);
			console.log(tx.contractTxId);
			setTxId(tx.contractTxId);
			setModalOpen(true);
			toast.success('Successfully Created');
		} catch (error) {
			console.log(error);
			toast.error(String(error));
		} finally {
			setIsCreating(false);
		}
	};

	const onBack = () => {
		router.push('/atomic-asset?step=initial-state');
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
			>
				<LicenseForm form={form} />
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
							'Create Asset'
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
				title={
					txId === '' ? 'Creating Atomic Asset...' : ' 🐘 Atomic Asset Created'
				}
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
								Transaction ID: <span className='font-medium text-primary'>{txId}</span>
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
							<div>Creating Atomic Asset</div>
						</div>
					)}
				</div>
			</Modal>
			{isExploding && <Confetti recycle={isExploding} numberOfPieces={100} />}
		</div>
	);
};

export default LicenseDetails;
