import { useQuery } from "@tanstack/react-query";
import { Sample } from "@/types/sample";
// import { Profile } from "@/types/profile";

interface SampleResponse {
	meta: {
		total: number;
	};
	data: Sample[];
}

export type SampleQueryParams = {
	page?: {
		offset?: number;
		limit?: number;
	};
	sampleId?: string;
	patientName?: string;
	activateTime?: string;
	resultTime?: string;
};

const fetchSamples = async (
	orgId: string,
	params?: SampleQueryParams
): Promise<SampleResponse> => {
	const searchParams = new URLSearchParams();

	console.log("fetchSamples", params);
	console.log("page:", params?.page);
	console.log("page offset:", params?.page?.offset);
	console.log("page limit:", params?.page?.limit);

	if (params?.page?.offset !== undefined) {
		searchParams.set("page[offset]", params.page.offset.toString());
	}
	if (params?.page?.limit !== undefined) {
		searchParams.set("page[limit]", params.page.limit.toString());
	}
	if (params?.sampleId) {
		searchParams.set("sampleId", params.sampleId);
	}
	if (params?.patientName) {
		searchParams.set("patientName", params.patientName);
	}
	if (params?.activateTime) {
		searchParams.set("activateTime", params.activateTime);
	}
	if (params?.resultTime) {
		searchParams.set("resultTime", params.resultTime);
	}

	console.log("searchParams", searchParams.toString());

	const url = `${
		process.env.NEXT_PUBLIC_APP_BASE_URL
	}/api/v1.0/org/${orgId}/sample${
		searchParams.toString() ? `?${searchParams.toString()}` : ""
	}`;

	console.log("fetchSamples url", url);

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Failed to fetch samples");
	}

	// Return mock data for development
	// const mockData: SampleResponse = {
	// 	meta: { total: 10000 },
	// 	data: Array.from({ length: 15 }, (_, i) => ({
	// 		id: `sample-${i}`,
	// 		type: "sample",
	// 		attributes: {
	// 			sampleId: `SAMPLE${String(i).padStart(5, "0")}`,
	// 			activateTime: new Date(
	// 				2024 - Math.floor(Math.random() * 2),
	// 				Math.floor(Math.random() * 12),
	// 				Math.floor(Math.random() * 28)
	// 			).toISOString(),
	// 			resultTime: new Date(
	// 				2024 - Math.floor(Math.random() * 2),
	// 				Math.floor(Math.random() * 12),
	// 				Math.floor(Math.random() * 28)
	// 			).toISOString(),
	// 			result: Math.random() > 0.5 ? "Positive" : "Negative",
	// 		},
	// 		relationships: {
	// 			profile: {
	// 				data: {
	// 					id: `profile-${i}`,
	// 					type: "profile",
	// 				},
	// 			},
	// 		},
	// 	})),
	// 	included: Array.from({ length: 15 }, (_, i) => ({
	// 		id: `profile-${i}`,
	// 		type: "profile",
	// 		attributes: {
	// 			name: `Patient ${i}`,
	// 			dateOfBirth: new Date(
	// 				1950 + Math.floor(Math.random() * 50),
	// 				Math.floor(Math.random() * 12),
	// 				Math.floor(Math.random() * 28)
	// 			).toISOString(),
	// 		},
	// 	})),
	// };

	// return Promise.resolve(mockData);
	return response.json();
};

export const useSample = (orgId: string, params?: SampleQueryParams) => {
	return useQuery({
		queryKey: ["samples", orgId, params],
		queryFn: () => fetchSamples(orgId, params),
	});
};
