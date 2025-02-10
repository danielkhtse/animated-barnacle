import { useQuery } from "@tanstack/react-query";

interface Profile {
	type: "profile";
	id: string;
	attributes: {
		name: string;
	};
}

interface Sample {
	id: string;
	type: "sample";
	attributes: {
		result: string;
		sampleId: string;
		resultType: "rtpcr" | "antigen" | "antibody";
		activateTime: string;
		resultTime: string;
	};
	relationships: {
		profile: {
			data: {
				type: "profile";
				id: string;
			};
		};
	};
}

interface SampleResponse {
	meta: {
		total: number;
	};
	data: Sample[];
	included: Profile[];
}

const fetchSamples = async (orgId: string): Promise<SampleResponse> => {
	const response = await fetch(`/v1.0/org/${orgId}/sample`);
	if (!response.ok) {
		throw new Error("Failed to fetch samples");
	}
	return response.json();
};

export const useSample = (orgId: string) => {
	return useQuery({
		queryKey: ["samples", orgId],
		queryFn: () => fetchSamples(orgId),
		select: (data) => ({
			...data,
			// Enhance data by adding profile information to each sample
			data: data.data.map((sample) => ({
				...sample,
				profile: data.included.find(
					(profile) =>
						profile.id === sample.relationships.profile.data.id
				),
			})),
		}),
	});
};
