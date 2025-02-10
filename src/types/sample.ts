import { Profile } from "@/types/profile";

export interface Sample {
	id: string;
	type: string;
	patientName: string;
	sampleBarcode: string;
	activationDate: string;
	resultDate: string;
	resultValue: string;
}
