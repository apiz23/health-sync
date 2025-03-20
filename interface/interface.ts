export interface Disease {
    id: string;
    name: string;
    category: string;
    description: string;
    created_at: string;
    user_id: string;
}

export interface CategorizedDiseases {
    major: Disease[];
    minor: Disease[];
}

export interface MedicationFormData {
    name: string;
    dosage: string;
    frequency: string;
    times: string[];
    startDate: Date;
    endDate?: Date | null;
    notes?: string;
}
