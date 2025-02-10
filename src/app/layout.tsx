import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Header } from "@/components/Header";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
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
				<div className="flex min-h-screen">
					<Navigation />

					<div className="flex-1 flex flex-col">
						<Header />
						<main className="flex-1 p-4 overflow-auto">
							{children}
						</main>
					</div>
				</div>
			</body>
		</html>
	);
}
