import { Medication } from "@/interface/interface";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaPills, FaClock } from "react-icons/fa"; // Import icons for better visuals

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
		return today.toISOString().split("T")[0];
	};

	const todaysMedications = medications.filter((medication: Medication) => {
		const today = new Date(getLocalDate());
		const startDate = new Date(medication.start_date);
		const endDate = medication.end_date
			? new Date(medication.end_date)
			: startDate;

		return today >= startDate && today <= endDate;
	});

	if (isLoading) {
		return (
			<div className="bg-[#FCFFE7] p-6 rounded-lg shadow-md border border-gray-100">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					Today's Schedule
				</h2>
				<p className="text-gray-500">Loading...</p>
			</div>
		);
	}

	return (
		<div className="bg-[#FCFFE7] p-6 rounded-lg shadow-md border border-gray-100">
			<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
				<FaPills /> Today's Schedule
			</h2>

			{todaysMedications.length > 0 ? (
				<ul className="space-y-4">
					{todaysMedications.map((medication) => (
						<li
							key={medication.id}
							className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
						>
							<div className="flex items-center gap-4">
								<div className="text-2xl text-blue-500">
									<FaPills />
								</div>
								<div>
									<p className="font-medium text-gray-800">{medication.name}</p>
									<p className="text-sm text-gray-500 flex items-center gap-1">
										<FaClock /> Time: {medication.time_of_day.join(", ")}
									</p>
								</div>
							</div>
							<p className="text-xs text-gray-500">Dosage: {medication.dosage}</p>
						</li>
					))}
				</ul>
			) : (
				<div className="text-center py-6">
					<p className="text-gray-500">No reminders for today</p>
				</div>
			)}
		</div>
	);
}
