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
							<div className='flex flex-row pt-[8vh]'>
								<Sidebar />
								<div className='ml-[16rem] w-full'>{children}</div>
							</div>
						</div>
					</ArweaveWalletKit>
				</NotificationProvider>
			</AntDesignConfigProvider>
		</>
	);
};

export default Layout;
