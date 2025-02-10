"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
	ChevronRight,
	ChevronLeft,
	Users,
	FileText,
	KeyRound,
} from "lucide-react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";

const ActiveLinkStyles = "min-w-full bg-[var(--active-link)] font-bold";

export function Navigation() {
	const [isCollapsed, setIsCollapsed] = useState(() => true);
	const pathname = usePathname();

	const initialCollapsedState = useMemo(() => {
		// Get initial state from cookie if it exists
		if (typeof document !== "undefined") {
			const saved = document.cookie.match(/navCollapsed=([^;]+)/);
			return saved ? saved[1] === "true" : false;
		}
		return false;
	}, []);

	useEffect(() => {
		setIsCollapsed(initialCollapsedState);
	}, [initialCollapsedState]);

	// Update cookie when state changes
	useEffect(() => {
		document.cookie = `navCollapsed=${isCollapsed}; path=/; max-age=31536000`; // 1 year expiry
	}, [isCollapsed]);

	return (
		<nav className="min-w-content bg-[var(--nav-bg)] text-[var(--nav-foreground)] transition-all duration-300">
			<div className="p-4 mb-6 flex items-center justify-between">
				{isCollapsed ? (
					<img
						src="/prenetics-Logo-initial.png"
						alt="Prenetics Logo"
						className="w-6"
						width={24}
						height={24}
					/>
				) : (
					<img
						src="/prenetics-Logo.svg"
						alt="Prenetics Logo"
						className="w-32"
						width={128}
						height={128}
					/>
				)}
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="p-2 hover:bg-gray-200 rounded-full">
					{isCollapsed ? (
						<ChevronRight className="size-5" />
					) : (
						<ChevronLeft className="size-5" />
					)}
				</button>
			</div>
			<NavigationMenu isCollapsed={isCollapsed}>
				<NavigationMenuList className="flex flex-col gap-2">
					<NavigationMenuItem
						className={cn(
							pathname === "/patients" && ActiveLinkStyles
						)}>
						<NavigationMenuLink href="/patients">
							<span className={cn("flex items-center gap-2")}>
								<Users className="size-6" />
								{!isCollapsed && (
									<span>Patient Management</span>
								)}
							</span>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem
						className={cn(
							pathname === "/results" && ActiveLinkStyles
						)}>
						<NavigationMenuLink href="/results">
							<span className={cn("flex items-center gap-2")}>
								<FileText className="size-6" />
								{!isCollapsed && <span>Result Upload</span>}
							</span>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem
						className={cn(
							pathname === "/kits" && ActiveLinkStyles
						)}>
						<NavigationMenuLink href="/kits">
							<span className={cn("flex items-center gap-2")}>
								<KeyRound className="size-6" />
								{!isCollapsed && <span>Kit Activation</span>}
							</span>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</nav>
	);
}
