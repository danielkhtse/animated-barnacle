import { useQuery } from "@tanstack/react-query";
import { Organization } from "@/types/organization";

interface OrganizationResponse {
	data: Organization[];
}

const fetchOrganization = async (): Promise<OrganizationResponse> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/v1.0/org`
	);
	if (!response.ok) {
		throw new Error("Failed to fetch organization");
	}

	const data = await response.json();

	return data;
};

export const useOrganization = () => {
	return useQuery({
		queryKey: ["organization"],
		queryFn: fetchOrganization,
	});
};
