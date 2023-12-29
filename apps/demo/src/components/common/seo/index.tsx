import { NextSeo } from 'next-seo';

const SEO = () => {
	return (
		<NextSeo
			title='Atomic Toolkit Demo'
			description='Demo Application for Atomics Toolkit'
			openGraph={{
				url: 'https://atomic-toolkit-demo.vercel.app/',
				title: 'Atomic Toolkit Demo',
				description: 'Demo Application for Atomics Toolkit',
				images: [
					{
						url: 'https://atomic-toolkit-demo.vercel.app/api/og?title=Demo%20Application',
						width: 1200,
						height: 630,
						alt: 'Atomic Toolkit Demo OG',
						type: 'image/png',
					},
				],
				siteName: 'Atomic Toolkit Demo',
			}}
			twitter={{
				handle: '@Envoy_1084',
				site: '@Envoy_1084',
				cardType: 'summary_large_image',
			}}
		/>
	);
};

export default SEO;
