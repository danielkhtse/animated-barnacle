import { Profile } from "@/types/profile";

export interface Sample {
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
