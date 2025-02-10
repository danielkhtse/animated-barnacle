export interface Sample {
	id: string;
	type: string;
	patientName: string;
	sampleBarcode: string;
	activationDate: string;
	resultDate: string;
	resultValue: string;
	resultType?: string;
	patientId?: string;
}
