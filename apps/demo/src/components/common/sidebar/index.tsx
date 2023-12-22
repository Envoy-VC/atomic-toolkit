import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import { Menu } from 'antd';
import type { MenuProps } from 'antd';

import { TbMenu2, TbBolt, TbCategoryPlus } from 'react-icons/tb';

type MenuItem = Required<MenuProps>['items'][number];

interface ISidebarItem {
	title: React.ReactNode;
	href: string;
}

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: 'group'
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		type,
	} as MenuItem;
}

const SidebarItem = ({ title, href }: ISidebarItem) => {
	const pathname = usePathname();
	return (
		<Link href={href} className='w-full'>
			<div
				className={clsx(
					'mx-1 w-full cursor-pointer rounded-md px-3 py-[6px] text-[0.9rem] transition-all duration-200 ease-in-out hover:bg-[#f4f5f7b7]',
					pathname === href && 'bg-[#F3F4F6]'
				)}
			>
				{title}
			</div>
		</Link>
	);
};

const Heading = ({ title }: { title: string }) => {
	return (
		<div className='px-4 text-[0.75rem] font-bold uppercase text-[#101827]'>
			{title}
		</div>
	);
};

const Divider = () => {
	return <div className='my-2' />;
};

const items: MenuProps['items'] = [
	getItem('Menu', 'root', <TbMenu2 className='text-lg' />, [
		getItem('Introduction', 'sub1', <TbBolt className='text-lg' />, [
			getItem(<SidebarItem title='Getting Started' href='/' />, 'sub1-1', null),
		]),
		getItem('Create', 'sub2', <TbCategoryPlus className='text-lg' />, [
			getItem(
				<SidebarItem title='Atomic Asset' href='/atomic-asset' />,
				'sub2-1',
				null
			),
			getItem(
				<SidebarItem title='Collection' href='/collection' />,
				'sub2-2',
				null
			),
		]),
	]),
];

const Sidebar = () => {
	return (
		<>
			<div className='fixed hidden h-full w-full max-w-[16rem] border-r-[1px] border-[#E5E7EB] px-4 py-8 lg:flex'>
				<div className='flex w-full flex-col gap-2'>
					<Heading title='Introduction' />
					<SidebarItem title='Getting Started' href='/' />
					<Divider />
					<Heading title='Create' />
					<div className='flex flex-col gap-1'>
						{sidebarItems.map((item, index) => (
							<SidebarItem key={index} {...item} />
						))}
					</div>
				</div>
			</div>
			{/** Small Screen Nav */}
			<div className='my-2 lg:hidden'>
				<Menu defaultSelectedKeys={['1']} mode='inline' items={items} />
			</div>
		</>
	);
};

const sidebarItems: ISidebarItem[] = [
	{
		title: 'Atomic Asset',
		href: '/atomic-asset',
	},
	{
		title: 'Collection',
		href: '/collection',
	},
];

export default Sidebar;
