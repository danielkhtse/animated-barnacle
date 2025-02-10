import { useQuery } from "@tanstack/react-query";

interface OrganizationResponse {
	data: Array<{
		id: string;
		type: string;
		attributes: {
			name: string;
		};
	}>;
}

const fetchOrganization = async (): Promise<OrganizationResponse> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/v1.0/org`
	);
	if (!response.ok) {
		throw new Error("Failed to fetch organization");
	}
	return response.json();
};

export const useOrganization = () => {
	return useQuery({
		queryKey: ["organization"],
		queryFn: fetchOrganization,
	});
};
