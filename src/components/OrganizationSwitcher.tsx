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
import { useCurrentOrg } from "@/hooks/useCurrentOrg";

export function OrganizationSwitcher() {
	const { data } = useOrganization();
	const organizations = data?.data ?? [];

	const { id: selectedOrgId, setCurrentOrg } = useCurrentOrg();

	const handleOrgChange = (orgId: string) => {
		const selectedOrg = organizations.find((org) => org.id === orgId);
		if (selectedOrg) {
			setCurrentOrg(selectedOrg);
		}
	};

	return (
		<Select onValueChange={handleOrgChange} value={selectedOrgId}>
			<SelectTrigger className="min-w-content">
				<div className="flex items-center gap-2 text-foreground">
					<Building className="size-5 text-gray-600" />
					<SelectValue placeholder="Select organization" />
				</div>
			</SelectTrigger>
			<SelectContent className="relative z-50 text-foreground">
				{organizations.map((org) => (
					<SelectItem
						key={org.id}
						value={org.id}
						className="cursor-pointer">
						{org.attributes.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
