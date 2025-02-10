"use client";

import { Building } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function OrganizationSwitcher() {
	const organizations = [
		{ id: "org1", name: "Acme Corp" },
		{ id: "org2", name: "Globex Corporation" },
	];

	return (
		<Select defaultValue="org1">
			<SelectTrigger className="min-w-content">
				<div className="flex items-center gap-2 text-foreground">
					<Building className="size-5 text-gray-600" />
					<SelectValue placeholder="Select organization" />
				</div>
			</SelectTrigger>
			<SelectContent className="relative z-50 text-foreground ">
				{organizations.map((org) => (
					<SelectItem
						key={org.id}
						value={org.id}
						className="cursor-pointer">
						{org.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
