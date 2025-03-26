"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Medication } from "@/interface/interface";
import Loader from "./loader";

export function MedicationList() {
	const [medications, setMedications] = useState<Medication[]>([]);
	const [diseases, setDiseases] = useState<{ id: string; name: string }[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const userId = sessionStorage.getItem("userId");

	useEffect(() => {
		if (!userId) {
			setIsLoading(false);
			return;
		}

		const fetchMedications = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_NEST_API_URL}/medications?userId=${userId}`
				);
				const responseData = await response.json();
				setMedications(Array.isArray(responseData.data) ? responseData.data : []);
			} catch (error) {
				console.error("Error fetching medications:", error);
				toast.error("Failed to load medications");
				setMedications([]);
			} finally {
				setIsLoading(false);
			}
		};

		const fetchDiseases = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_NEST_API_URL}/diseases?userId=${userId}`
				);
				if (!response.ok) throw new Error("Failed to fetch diseases.");
				const data = await response.json();
				setDiseases(data);
			} catch (error) {
				console.error("Error fetching diseases:", error);
				toast.error("Failed to fetch diseases.");
			}
		};

		fetchMedications();
		fetchDiseases();
	}, [userId]);

	// Helper function to get disease name
	const getDiseaseName = (diseaseId: string) => {
		const disease = diseases.find((d) => d.id === diseaseId);
		return disease ? disease.name : "Unknown Disease";
	};

	// Loading state
	if (isLoading) return <Loader />;

	// No user logged in
	if (!userId) {
		return (
			<div className="text-center p-4 text-gray-500">
				Please log in to view medications
			</div>
		);
	}

	// No medications found
	if (medications.length === 0) {
		return (
			<div className="text-center p-4 text-gray-500">
				No medications found. Add your first medication to get started.
			</div>
		);
	}

	return (
		<div className="h-fit py-10">
			<h2 className="text-2xl font-bold mb-4">Your Medications</h2>
			{/* Medication List */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{medications.map((medication) => (
					<Card key={medication.id} className="space-y-3 bg-[#A6CDC6]">
						<Dialog>
							<CardHeader className="flex justify-between">
								<div className="text-left">
									<p>Medication Name: {medication.name}</p>
									<p>Frequency: {medication.frequency}</p>
								</div>
							</CardHeader>
							<CardContent className="flex justify-end">
								<DialogTrigger asChild>
									<Button>View</Button>
								</DialogTrigger>
							</CardContent>
							<DialogContent>
								<DialogHeader>
									<DialogTitle className="text-black">Details</DialogTitle>
								</DialogHeader>
								<div className="flow-root space-y-4">
									<dl className="-my-3 divide-y divide-gray-200 text-sm">
										{/* Medication Name */}
										<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
											<dt className="font-medium text-gray-900">Medication Name</dt>
											<dd className="text-gray-700 sm:col-span-2 font-bold">
												{medication.name}
											</dd>
										</div>

										{/* Disease */}
										<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
											<dt className="font-medium text-gray-900">Disease</dt>
											<dd className="text-gray-700 sm:col-span-2">
												{getDiseaseName(medication.disease_id)}
											</dd>
										</div>

										{/* Dosage */}
										<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
											<dt className="font-medium text-gray-900">Dosage</dt>
											<dd className="text-gray-700 sm:col-span-2">{medication.dosage}</dd>
										</div>

										{/* Frequency */}
										<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
											<dt className="font-medium text-gray-900">Frequency</dt>
											<dd className="text-gray-700 sm:col-span-2">
												{medication.frequency}
											</dd>
										</div>

										{/* Start Date */}
										<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
											<dt className="font-medium text-gray-900">Start Date</dt>
											<dd className="text-gray-700 sm:col-span-2">
												{new Date(medication.start_date).toLocaleDateString()}
											</dd>
										</div>

										{/* End Date (Optional) */}
										{medication.end_date && (
											<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
												<dt className="font-medium text-gray-900">End Date</dt>
												<dd className="text-gray-700 sm:col-span-2">
													{new Date(medication.end_date).toLocaleDateString()}
												</dd>
											</div>
										)}

										<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
											<dt className="font-medium text-gray-900">Scheduled Times</dt>
											<dd className="text-gray-700 sm:col-span-2">
												{medication.time_of_day.length > 0 ? (
													<ul className="list-disc list-inside space-y-1">
														{medication.time_of_day.map((time, index) => (
															<li key={index}>{time}</li>
														))}
													</ul>
												) : (
													"No scheduled times"
												)}
											</dd>
										</div>
									</dl>
								</div>

								{/* Close Button */}
								<DialogFooter>
									<DialogClose>
										<Button variant="outline" className="text-black">
											Cancel
										</Button>
									</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</Card>
				))}
			</div>
		</div>
	);
}
