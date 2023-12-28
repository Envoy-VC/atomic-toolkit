import React from 'react';
import type { MenuProps } from 'antd';
import { Dropdown, Button, Image } from 'antd';

import { ConnectWallet, useAddress, useDisconnect } from '@thirdweb-dev/react';

import { useConnection, useActiveAddress } from 'arweave-wallet-kit';
import { TbLogout } from 'react-icons/tb';

const ConnectButton = () => {
	const { connected, connect, disconnect } = useConnection();
	const ethAddress = useAddress();
	const arAddress = useActiveAddress();
	const ethDisconnect = useDisconnect();

	const shortenAddress = (address: string) => {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	const onDisconnect = () => {
		if (connected) {
			disconnect();
		}
		if (ethAddress) {
			ethDisconnect();
		}
	};

	const items: MenuProps['items'] = [
		{
			key: 'ar-wallet',
			label: (
				<Button
					type='primary'
					className='!flex w-full !items-center !justify-center !rounded-lg !bg-[#1A1523] !py-[23px] !text-[1.1rem] font-medium'
					onClick={connect}
				>
					Arweave
				</Button>
			),
		},
		{
			key: 'eth-wallet',
			label: <ConnectWallet btnTitle='Ethereum' />,
		},
	];

	if (!connected && ethAddress === undefined) {
		return (
			<Dropdown menu={{ items }} trigger={['click']}>
				<Button size='large'>Connect</Button>
			</Dropdown>
		);
	} else {
		return (
			<div className='flex flex-row items-center gap-2'>
				<Image
					src={
						ethAddress
							? 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png'
							: 'https://cryptologos.cc/logos/arweave-ar-logo.png'
					}
					preview={false}
					className='max-w-5 h-full max-h-5 w-full object-cover '
				/>
				<div className='text-[0.9rem]'>
					{connected && shortenAddress(arAddress ?? '')}
					{ethAddress && shortenAddress(ethAddress ?? '')}
				</div>
				<Button
					onClick={onDisconnect}
					icon={<TbLogout className='text-xl' />}
					type='text'
				/>
			</div>
		);
	}
};

export default ConnectButton;
