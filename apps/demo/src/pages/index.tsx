import React from 'react';
import type { ReactElement } from 'react';
import { Layout } from '~/components';
import type { NextPageWithLayout } from './_app';

import { useAtomicToolkit } from '~/stores';

import { Button } from 'antd';

const Home: NextPageWithLayout = () => {
	const { atomicToolkit } = useAtomicToolkit();
	const [str, setStr] = React.useState<string>('idle');
	if (!atomicToolkit) {
		return null;
	}

	const callback = (progress: string) => {
		setStr(progress);
	};
	const { progress, mutateAsync } = atomicToolkit.collection.test(callback);

	return (
		<div className='w-full p-8'>
			<div className='mx-auto w-full max-w-screen-lg border-2'>
				<Button
					onClick={() => {
						mutateAsync().then((res) => {
							console.log(res);
						});
					}}
				>
					Click
				</Button>

				<div className='flex flex-col gap-8'>
					<span>{progress}</span>
					<span>{str}</span>
				</div>
			</div>
		</div>
	);
};

Home.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Home;
