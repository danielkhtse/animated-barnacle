import { useQuery } from "@tanstack/react-query";
import { Sample } from "@/types/sample";

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
	resultValue?: string;
	resultType?: string;
	patientId?: string;
};

const fetchSamples = async (
	orgId: string,
	params?: SampleQueryParams
): Promise<SampleResponse> => {
	const searchParams = new URLSearchParams();

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
	if (params?.resultValue) {
		searchParams.set("resultValue", params.resultValue);
	}
	if (params?.resultType) {
		searchParams.set("resultType", params.resultType);
	}
	if (params?.patientId) {
		searchParams.set("patientId", params.patientId);
	}
	const url = `${
		process.env.NEXT_PUBLIC_APP_BASE_URL
	}/api/v1.0/org/${orgId}/sample${
		searchParams.toString() ? `?${searchParams.toString()}` : ""
	}`;

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Failed to fetch samples");
	}

	return response.json();
};

export const useSample = (orgId: string, params?: SampleQueryParams) => {
	return useQuery({
		queryKey: ["samples", orgId, params],
		queryFn: () => fetchSamples(orgId, params),
	});
};
