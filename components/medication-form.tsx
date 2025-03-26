"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { MedicationFormData } from "@/interface/interface";

export function MedicationForm() {
	const userId = sessionStorage.getItem("userId");
	const [diseases, setDiseases] = useState<{ id: string; name: string }[]>([]);
	const [formData, setFormData] = useState<MedicationFormData>({
		name: "",
		dosage: "",
		frequency: "daily",
		times: ["09:00"],
		startDate: new Date(),
		endDate: null,
		notes: "",
		diseaseId: "",
	});

	useEffect(() => {
		const fetchDiseases = async () => {
			try {
				const response = await fetch(`api/diseases?userId=${userId}`);
				if (!response.ok) throw new Error("Failed to fetch diseases");
				const data = await response.json();
				setDiseases(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchDiseases();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			console.log(userId);
			const payload = {
				...formData,
				userId: userId,
			};

			console.log("Sending payload:", payload);

			const response = await fetch(`api/medications/add`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error("Backend error:", errorData);
				throw new Error(errorData.error || "Failed to add medication");
			}

			toast.success("Medication reminder added successfully!");
			setFormData({
				name: "",
				dosage: "",
				frequency: "daily",
				times: ["09:00"],
				startDate: new Date(),
				endDate: null,
				notes: "",
				diseaseId: "",
			});
		} catch (error) {
			console.error("Frontend error:", error);
			toast.error("Failed to add medication reminder");
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" className="text-black w-fit bg-white">
					Add New Medication
				</Button>
			</DialogTrigger>
			<DialogContent className="overflow-auto p-6 h-[60vh] min-w-fit">
				<DialogHeader>
					<DialogTitle className="text-black">Add Medication Reminder</DialogTitle>
					<DialogDescription>
						Set up reminders for your medication schedule
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 text-black">
					<div className="space-y-2">
						<Label htmlFor="disease">Disease</Label>
						<Select
							value={formData.diseaseId}
							onValueChange={(value) =>
								setFormData((prev) => ({ ...prev, diseaseId: value }))
							}
							required
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select Disease" />
							</SelectTrigger>
							<SelectContent>
								{diseases.map((disease) => (
									<SelectItem key={disease.id} value={disease.id}>
										{disease.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{/* Medication Name */}
					<div className="space-y-2">
						<Label htmlFor="name">Medication Name</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									name: e.target.value,
								}))
							}
							placeholder="Fever"
							required
						/>
					</div>

					{/* Dosage */}
					<div className="space-y-2">
						<Label htmlFor="dosage">Dosage</Label>
						<Input
							id="dosage"
							value={formData.dosage}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									dosage: e.target.value,
								}))
							}
							placeholder="e.g., 500mg"
							required
						/>
					</div>

					{/* Frequency */}
					<div className="space-y-2">
						<Label htmlFor="frequency">Frequency</Label>
						<Select
							value={formData.frequency}
							onValueChange={(value) =>
								setFormData((prev) => ({
									...prev,
									frequency: value,
								}))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select frequency" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="daily">Once Daily</SelectItem>
								<SelectItem value="twice_daily">Twice Daily</SelectItem>
								<SelectItem value="weekly">Weekly</SelectItem>
								<SelectItem value="custom">Custom</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Reminder Times */}
					<div className="space-y-2">
						<Label>Reminder Times</Label>
						<div className="space-y-2">
							{formData.times.map((time, index) => (
								<div key={index} className="flex gap-2">
									<Input
										type="time"
										value={time}
										onChange={(e) => {
											const newTimes = [...formData.times];
											newTimes[index] = e.target.value;
											setFormData((prev) => ({
												...prev,
												times: newTimes,
											}));
										}}
										className="w-[150px]"
									/>
									{index > 0 && (
										<Button
											type="button"
											variant="destructive"
											onClick={() => {
												const newTimes = formData.times.filter((_, i) => i !== index);
												setFormData((prev) => ({
													...prev,
													times: newTimes,
												}));
											}}
										>
											Remove
										</Button>
									)}
								</div>
							))}
							{formData.times.length < 4 && (
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setFormData((prev) => ({
											...prev,
											times: [...prev.times, "09:00"],
										}));
									}}
								>
									Add Time
								</Button>
							)}
						</div>
					</div>

					{/* Start and End Dates */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-3">
							<Label>Start Date</Label>
							<Calendar
								mode="single"
								selected={formData.startDate}
								onSelect={(date) =>
									date &&
									setFormData((prev) => ({
										...prev,
										startDate: date,
									}))
								}
								className="rounded-md border w-full sm:w-fit"
							/>
						</div>
						<div className="space-y-3">
							<Label>End Date (Optional)</Label>
							<Calendar
								mode="single"
								selected={formData.endDate || undefined}
								onSelect={(date) =>
									setFormData((prev) => ({
										...prev,
										endDate: date || undefined,
									}))
								}
								className="rounded-md border w-full sm:w-fit"
							/>
						</div>
					</div>

					{/* Notes */}
					<div className="space-y-2">
						<Label htmlFor="notes">Notes (Optional)</Label>
						<Input
							id="notes"
							value={formData.notes}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									notes: e.target.value,
								}))
							}
						/>
					</div>

					{/* Submit Button */}
					<DialogFooter>
						<div className="flex justify-end">
							<Button type="submit" className="w-fit">
								Save Medication
							</Button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
