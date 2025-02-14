import React from 'react';
import './variable.css';
import './rte_theme_default.css'
import { AuthContextProvider } from '@/contexts/AuthContext';
import AntdConfig from '@/lib/AntdConfig';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Providers from '@/components/Providers';
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import NextTopLoader from 'nextjs-toploader';
import { ConfigProvider } from 'antd';
import Script from 'next/script';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getBrandDetails } from '@/lib/frontendApi';

export const metadata: Metadata = {
	title: "Smart Exams",
	description: "Smart Exams Nextjs app",
	generator: "Next.js",
	manifest: "/manifest.json",
	keywords: ["nextjs", "nextjs13", "next13", "pwa", "next-pwa"],
	themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
	authors: [
		{ name: "Binary Data" },
		{
			name: "Binary Data",
		},
	],
	viewport:
		"minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
};

export default async function LocaleLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
	const response = await getBrandDetails();
	const brandDetails = response.data;
	return (
		<html lang={locale}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.carousel.min.css" />
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.theme.min.css" />
				<link rel="icon" href={`${process.env["NEXT_PUBLIC_IMAGE_URL"]}/brandImage/original/${brandDetails.favIcon}`} sizes="any" />
				<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
				<link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
				<link rel="stylesheet" href="/richtexteditor/rte_theme_default.css" />
				<Script
					type="text/javascript"
					src="/richtexteditor/rte.js"
					strategy="afterInteractive"
				/>
				<Script
					type="text/javascript"
					src="/richtexteditor/plugins/all_plugins.js"
					strategy="afterInteractive"
				/>
			</head>
			<body className="bg-light-white">
				<NextIntlClientProvider>
					<AntdRegistry>
						<AuthContextProvider locale={locale}>
							<AntdConfig>
								<ConfigProvider
									theme={{
										token: {
											colorPrimary: '#8C52FF',
											borderRadius: 4,
											colorBgContainer: '#fff',
										},
										components: {
											Button: {
												colorPrimary: '#8C52FF',
												colorText: '#8C52FF'
											},
											Input: {
												borderRadius: 0,
												colorText: '#202020B2',
											},
											Select: {
												borderRadius: 0,
												colorText: '#202020B2',
												borderRadiusOuter: 0
											},
											Form: {
												labelColor: '#202020B2',
												colorText: '#202020B2',
											},
											Dropdown: {
												colorText: '#202020B2'
											}
										},
									}}>
									<NextTopLoader
										color="#3098a0"
										showSpinner={false}
									/>
									<Providers>
										{children}
									</Providers>
								</ConfigProvider>
							</AntdConfig>
						</AuthContextProvider>
					</AntdRegistry>
				</NextIntlClientProvider>
				<Script
					src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
					integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
					crossOrigin="anonymous"
				/>
				<Script
					type="text/javascript"
					src="https://code.jquery.com/jquery-1.12.0.min.js"
				></Script>
				<Script
					src="https://pagead2.googlesyndication.com/pagead/managed/js/adsense/m202412030101/show_ads_impl_fy2021.js"
				></Script>
				<Script
					type="text/javascript"
					src="https://cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.carousel.min.js"
				></Script>

			</body>
		</html >
	);
}
