import React from 'react';
import { AntDesignConfigProvider, NotificationProvider } from '~/providers';

import { ArweaveWalletKit } from 'arweave-wallet-kit';

import clsx from 'clsx';
import { Navbar, SEO, Sidebar } from '~/components/common';

// Font
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

interface Props {
	children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
	return (
		<>
			<SEO />

			<AntDesignConfigProvider>
				<NotificationProvider>
					<ArweaveWalletKit
						theme={{
							displayTheme: 'light',
						}}
						config={{
							permissions: [
								'ACCESS_ALL_ADDRESSES',
								'ACCESS_ADDRESS',
								'ACCESS_PUBLIC_KEY',
								'ACCESS_ARWEAVE_CONFIG',
								'SIGNATURE',
							],
						}}
					>
						<div className={clsx(inter.className)}>
							<Navbar />
							<div className='flex flex-col pt-[8vh] lg:flex-row'>
								<Sidebar />
								<div className='w-full lg:ml-[16rem]'>{children}</div>
							</div>
						</div>
					</ArweaveWalletKit>
				</NotificationProvider>
			</AntDesignConfigProvider>
		</>
	);
};

export default Layout;
