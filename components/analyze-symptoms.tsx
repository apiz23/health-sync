"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { AiAnalysis } from "@/interface/interface";

export default function SymptomAnalysisDialog() {
	const [symptoms, setSymptoms] = useState("");
	const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [showAnalysis, setShowAnalysis] = useState(false);
	const [showAddOption, setShowAddOption] = useState(false);
	const [formData, setFormData] = useState({
		userId: "",
		name: "",
		classification: "minor",
		description: "",
	});

	useEffect(() => {
		const storedUserId = sessionStorage.getItem("userId");
		if (storedUserId) {
			setFormData((prev) => ({ ...prev, userId: storedUserId }));
		}
	}, []);

	const analyzeSymptoms = async () => {
		if (!symptoms.trim()) return;

		setIsAnalyzing(true);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_PYTHON_API}/analyze`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ symptoms }),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to analyze symptoms.");
			}

			const data = await response.json();
			setAiAnalysis(data);
			setFormData((prev) => ({
				...prev,
				name: data.possible_disease || "",
				description: symptoms,
			}));
			setShowAnalysis(true);
			setShowAddOption(true);
		} catch (error) {
			console.error("Error:", error);
			alert("Something went wrong while analyzing. Please try again.");
		} finally {
			setIsAnalyzing(false);
		}
	};

	const addDiseaseToDatabase = async () => {
		try {
			const response = await fetch(`api/add-disease`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error("Failed to add disease.");
			}

			alert("Disease added successfully!");
			setShowAddOption(false);
			setShowAnalysis(false);
			setSymptoms("");
			setAiAnalysis(null);
		} catch (error) {
			console.error("Error:", error);
			alert("Something went wrong while adding the disease.");
		}
	};

	return (
		<Dialog>
			<DialogTrigger className="py-2 text-center">
				<Button variant="outline" className="text-black w-full bg-white">
					Diagnose Symptoms
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-black">Diagnose Symptoms</DialogTitle>
					<DialogDescription>
						Describe your symptoms, and our AI will analyze them.
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4 space-y-4">
					<div className="space-y-2">
						<Label htmlFor="symptoms" className="text-black">
							Describe your symptoms
						</Label>
						<Textarea
							id="symptoms"
							placeholder="Example: I have been experiencing headaches, fever, and fatigue for the past 2 days..."
							className="h-32 text-black"
							value={symptoms}
							onChange={(e) => setSymptoms(e.target.value)}
						/>
					</div>

					{showAnalysis && aiAnalysis && (
						<div className="border rounded-lg p-4 bg-gray-100 text-black">
							<p>
								<strong>Possible Disease:</strong>{" "}
								{aiAnalysis.possible_disease || "Unknown"}
							</p>
							<p>
								<strong>Confidence Level:</strong>{" "}
								{aiAnalysis.confidence_level || "N/A"}
							</p>
							<p>
								<strong>Suggested Action:</strong>{" "}
								{aiAnalysis.suggested_action || "Consult a doctor"}
							</p>
						</div>
					)}
				</div>

				{showAddOption && (
					<div className="mt-4 space-y-4 text-black">
						<h3 className="text-lg font-semibold">
							Do you want to add this disease?
						</h3>
						<div className="space-y-2">
							<Label htmlFor="name">
								Disease Name
							</Label>

							<p className="text-xs text-gray-500">
								Please choose based on the doctor{"'"}s prescription.
							</p>

							<Input
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, name: e.target.value }))
								}
								placeholder="Enter disease name"
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="classification">Classification</Label>
							<RadioGroup
								value={formData.classification}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, classification: value }))
								}
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="minor" id="minor" />
									<Label htmlFor="minor">Minor</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="major" id="major" />
									<Label htmlFor="major">Major</Label>
								</div>
							</RadioGroup>
						</div>
					</div>
				)}

				<DialogFooter className="mt-4">
					{!showAnalysis ? (
						<Button
							type="button"
							onClick={analyzeSymptoms}
							disabled={!symptoms || isAnalyzing}
						>
							{isAnalyzing ? (
								<>
									<Loader className="mr-2 h-4 w-4 animate-spin" />
									Analyzing...
								</>
							) : (
								"Analyze Symptoms"
							)}
						</Button>
					) : showAddOption ? (
						<div className="flex gap-2 w-full">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setShowAnalysis(false);
									setSymptoms("");
									setAiAnalysis(null);
									setShowAddOption(false);
								}}
								className="flex-1 text-black"
							>
								Cancel
							</Button>
							<Button type="button" className="flex-1" onClick={addDiseaseToDatabase}>
								Add Disease
							</Button>
						</div>
					) : (
						<Button type="submit" className="w-full">
							Save Analysis
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
