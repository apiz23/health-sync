"use client";

import { useState } from "react";
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

export default function SymptomAnalysisDialog() {
	const [symptoms, setSymptoms] = useState("");
	const [aiAnalysis, setAiAnalysis] = useState<any>(null);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [showAnalysis, setShowAnalysis] = useState(false);

	const analyzeSymptoms = async () => {
		if (!symptoms.trim()) return;

		setIsAnalyzing(true);

		try {
			const response = await fetch("http://127.0.0.1:8000/analyze", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ symptoms }),
			});

			if (!response.ok) {
				throw new Error("Failed to analyze symptoms.");
			}

			const data = await response.json();
			setAiAnalysis(data);
			setShowAnalysis(true);
		} catch (error) {
			console.error("Error:", error);
			alert("Something went wrong while analyzing. Please try again.");
		} finally {
			setIsAnalyzing(false);
		}
	};

	return (
		<Dialog>
			<DialogTrigger className="py-2 text-center">
				<Button variant="default" className="text-white">
					Add New Symptoms
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Add New Symptoms</DialogTitle>
					<DialogDescription>
						Describe your symptoms, and our AI will analyze them.
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4 space-y-4">
					<div className="space-y-2">
						<Label htmlFor="symptoms">Describe your symptoms</Label>
						<Textarea
							id="symptoms"
							placeholder="Example: I have been experiencing headaches, fever, and fatigue for the past 2 days..."
							className="h-32"
							value={symptoms}
							onChange={(e) => setSymptoms(e.target.value)}
						/>
					</div>

					{showAnalysis && aiAnalysis && (
						<div className="border rounded-lg p-4 bg-gray-100">
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
					) : (
						<div className="flex gap-2 w-full">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setShowAnalysis(false);
									setSymptoms("");
									setAiAnalysis(null);
								}}
								className="flex-1"
							>
								Start Over
							</Button>
							<Button type="submit" className="flex-1">
								Save Analysis
							</Button>
						</div>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
