import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface ISidebarItem {
	title: React.ReactNode;
	href: string;
}

const SidebarItem = ({ title, href }: ISidebarItem) => {
	const pathname = usePathname();
	return (
		<Link href={href}>
			<div
				className={clsx(
					'mx-1 cursor-pointer rounded-md px-3 py-[6px] text-[0.9rem] transition-all duration-200 ease-in-out hover:bg-[#f4f5f7b7]',
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

const Sidebar = () => {
	return (
		<div className='fixed h-full w-full max-w-[16rem] border-r-[1px] border-[#E5E7EB] px-4 py-8'>
			<div className='flex flex-col gap-2'>
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
