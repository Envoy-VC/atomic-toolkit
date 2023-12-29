import React from 'react';
import type { ReactElement } from 'react';
import { Layout } from '~/components';
import type { NextPageWithLayout } from './_app';

import { useAtomicToolkit } from '~/stores';

import { TbStack3 } from 'react-icons/tb';
import { RiNftLine } from 'react-icons/ri';

import Link from 'next/link';

const createItems = [
	{
		title: 'Create Atomic Asset',
		Icon: RiNftLine,
		description:
			'Create a single atomic asset. Upload Asset and Specify License.',
		href: '/atomic-asset',
	},
	{
		title: 'Create Collection',
		Icon: TbStack3,
		description:
			'Create a collection of atomic assets. Create multiple Atomic Assets and group them in a collection',
		href: '/collection',
	},
];

const Home: NextPageWithLayout = () => {
	return (
		<div className='w-full p-6 sm:p-8'>
			<div className='mx-auto flex w-full max-w-screen-lg flex-col gap-3'>
				<div className='text-4xl font-semibold'>Introduction</div>
				<p className='whitespace-pre-line'>
					Atomic Toolkit is an NPM package designed to simplify the creation and
					deployment of atomic assets on Arweave. It prioritizes developer experience
					with robust type safety and clear API documentation, ensuring accurate
					asset creation that adheres to Arweave specifications.
				</p>
				<div className='my-4 text-3xl font-semibold'>Create</div>
				<div className='flex flex-col gap-2'>
					{createItems.map((item, index) => (
						<div className='rounded-md border-[1px] border-gray-300 p-4' key={index}>
							<div className='flex flex-row gap-4'>
								<div>
									<item.Icon className='text-5xl text-gray-700' />
								</div>
								<div className='flex flex-col'>
									<Link
										href={item.href}
										className='text-xl font-medium text-slate-700 hover:underline'
									>
										{item.title}
									</Link>
									<p className='text-gray-600'>{item.description}</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className='my-4 text-3xl font-semibold'>Documentation</div>
				<div>
					Documentation is available at{' '}
					<Link
						target='_blank'
						href='https://atomictoolkit.mintlify.app/introduction'
						className='text-blue-700 hover:underline'
					>
						https://atomictoolkit.mintlify.app
					</Link>
				</div>
				<div>
					Atomic Toolkit is an open-source project. You can find the source code{' '}
					<Link
						target='_blank'
						href='https://github.com/Envoy-VC/atomic-toolkit'
						className='text-blue-700 hover:underline'
					>
						here
					</Link>
				</div>
			</div>
		</div>
	);
};

Home.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Home;
