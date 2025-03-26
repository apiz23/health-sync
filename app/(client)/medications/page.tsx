import { MedicationForm } from "@/components/medication-form";
import { MedicationList } from "@/components/medication-list";
import React from "react";

export default function Page() {
	return (
		<>
			<div className="h-fit">
				<h1 className="scroll-m-20 text-5xl md:text-6xl font-extrabold tracking-tight lg:text-5xl my-10">
					Medication List
				</h1>

				{/* Medication Form */}
				<div className="flex justify-between items-center">
					<MedicationForm />
				</div>
				<MedicationList />
			</div>
		</>
	);
}
