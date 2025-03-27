export interface Disease {
	id: string;
	user_id: string;
	name: string;
	classification: string;
	description: string;
	created_at: string;
}

export interface MedicationFormData {
	name: string;
	dosage: string;
	frequency: string;
	times: string[];
	startDate: Date;
	endDate?: Date | null;
	notes?: string;
	diseaseId: string;
}

export interface Medication {
	id: string;
	disease_id: string;
	name: string;
	dosage: string;
	frequency: string;
	time_of_day: string[];
	start_date: string;
	end_date: string | null;
	notes: string | null;
	created_at: string;
	user_id: string;
}

export interface AiAnalysis {
	possible_disease?: string;
	confidence_level?: string;
	suggested_action?: string;
}
