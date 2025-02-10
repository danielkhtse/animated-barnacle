"use client";

import { Globe } from "lucide-react";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";

import { usePathname } from "next/navigation";
import { navigationItems } from "@/components/Navigation";

export function Header() {
	const pathname = usePathname();

	const getPageTitle = () => {
		const matchedItem = navigationItems.find(
			(item) => item.href === pathname
		);
		return matchedItem?.label || "Dashboard";
	};

	return (
		<header className="h-16 border-b bg-white px-6 flex items-center justify-between">
			{/* Left side - Page Title */}
			<h1 className="text-xl font-semibold text-gray-800">
				{getPageTitle()}
			</h1>

			{/* Right side - Switchers */}
			<div className="flex items-center gap-2">
				{/* Organization Switcher */}
				<OrganizationSwitcher />

				{/* Language Switcher */}
				<div className="flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer">
					<Globe className="h-5 w-5 text-gray-600" />
					<span className="text-gray-800">English</span>
				</div>
			</div>
		</header>
	);
}
