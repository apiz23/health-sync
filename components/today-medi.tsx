import { Medication } from "@/interface/interface";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function TodayMedi() {
	const [medications, setMedications] = useState<Medication[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchMedications() {
			const userId = sessionStorage.getItem("userId");

			if (!userId) {
				console.warn("User ID not found");
				setIsLoading(false);
				return;
			}

			try {
				const response = await fetch(`api/medications?userId=${userId}`);
				const responseData = await response.json();

				setMedications(responseData.data || []);
			} catch (error) {
				console.error("Error fetching medications:", error);
				toast.error("Failed to load medications");
				setMedications([]);
			} finally {
				setIsLoading(false);
			}
		}

		fetchMedications();
	}, []);

	const getLocalDate = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const todaysMedications = medications.filter((medication: Medication) => {
		const today = getLocalDate();
		const medStartDate = new Date(medication.start_date).toLocaleDateString(
			"en-CA"
		);

		return medStartDate === today;
	});

	if (isLoading) {
		return (
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold mb-4">Today{"'"}s Schedule</h2>
				<p className="text-gray-600">Loading...</p>
			</div>
		);
	}

	return (
		<div className="bg-[#A6CDC6] p-6 rounded-lg shadow">
			<h2 className="text-xl font-semibold mb-4 text-black">
				Today{"'"}s Schedule
			</h2>

			{todaysMedications.length > 0 ? (
				<ul className="space-y-2">
					{todaysMedications.map((medication) => (
						<li key={medication.id} className="flex justify-between items-center">
							<div>
								<p className="font-medium">{medication.name}</p>
								<p className="text-sm text-gray-600">
									Time: {medication.time_of_day.join(", ")}
								</p>
							</div>
							<p className="text-xs text-gray-500">Dosage: {medication.dosage}</p>
						</li>
					))}
				</ul>
			) : (
				<p className="text-gray-600">No reminders for today</p>
			)}
		</div>
	);
}
