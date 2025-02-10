"use client";

import { Building } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useOrganization } from "@/hooks/useOrganization";

export function OrganizationSwitcher() {
	const { data } = useOrganization();
	const organizations =
		data?.data.map((org) => ({
			id: org.id,
			name: org.attributes.name,
		})) ?? [];

	const handleOrgChange = (orgId: string) => {
		const selectedOrg = organizations.find((org) => org.id === orgId);
		if (selectedOrg) {
			localStorage.setItem("selectedOrg", JSON.stringify(selectedOrg));
			// Refresh the page to apply the new organization context
			window.location.reload();
		}
	};

	return (
		<Select onValueChange={handleOrgChange}>
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
