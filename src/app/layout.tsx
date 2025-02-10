import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: process.env.NEXT_PUBLIC_APP_NAME,
	description: "Prenetics Demo",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Providers>
					<div className="flex min-h-screen">
						<Navigation />

						<div className="flex-1 flex flex-col">
							<Header />
							<main className="flex-1 p-4 overflow-auto">
								{children}
							</main>
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
