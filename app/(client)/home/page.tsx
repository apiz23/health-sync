"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { IoWarningOutline, IoAlertCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { CategorizedDiseases } from "@/interface/interface";
import SymptomAnalysisDialog from "@/components/analyze-symptoms";
import ChatDialog from "@/components/chat";
import { Button } from "@/components/ui/button";
import { TodayMedi } from "@/components/today-medi";

export default function Page() {
	const [diseases, setDiseases] = useState<CategorizedDiseases>({
		major: [],
		minor: [],
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchDiseases() {
			try {
				setIsLoading(true);
				const userId = sessionStorage.getItem("userId");
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_NEST_API_URL}/diseases/${userId}`
				);
				const data = await response.json();

				const diseasesArray = Array.isArray(data) ? data : [data];
				
				const categorizedDiseases = {
					major: diseasesArray.filter(
						(d) =>
							d.category.toLowerCase().includes("chronic") ||
							d.category.toLowerCase().includes("major")
					),
					minor: diseasesArray.filter(
						(d) =>
							!d.category.toLowerCase().includes("chronic") &&
							!d.category.toLowerCase().includes("major")
					),
				};

				setDiseases(categorizedDiseases);
			} catch (error) {
				console.error("Failed to fetch diseases:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchDiseases();
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
			</div>
		);
	}

	return (
		<div className="min-h-screen space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Major Conditions */}
				<Card className="p-6 bg-red-50 border-red-200">
					<CardHeader className="flex items-center gap-2 mb-4">
						<IoWarningOutline className="text-red-600 w-6 h-6" />
						<h2 className="text-xl font-semibold text-red-900">Major Conditions</h2>
					</CardHeader>
					<div className="space-y-3">
						{diseases.major.length > 0 ? (
							diseases.major.map((disease) => (
								<div
									key={disease.id}
									className="bg-white p-4 rounded-lg border border-red-200"
								>
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-medium text-red-900">{disease.name}</h3>
											<p className="text-sm text-gray-600">Category: {disease.category}</p>
											<p className="text-sm text-gray-600 mt-1">{disease.description}</p>
											<p className="text-xs text-gray-500 mt-2">
												Added:
												{new Date(disease.created_at).toLocaleDateString()}
											</p>
										</div>
										<Badge className="bg-red-100 text-red-700">{disease.category}</Badge>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-600 text-center">No major conditions recorded</p>
						)}
					</div>
				</Card>

				{/* Minor Conditions */}
				<Card className="p-6 bg-yellow-50 border-yellow-200">
					<CardHeader className="flex items-center gap-2 mb-4">
						<IoAlertCircleOutline className="text-yellow-600 w-6 h-6" />
						<h2 className="text-xl font-semibold text-yellow-900">
							Minor Conditions
						</h2>
					</CardHeader>
					<div className="space-y-3">
						{diseases.minor.length > 0 ? (
							diseases.minor.map((disease) => (
								<div
									key={disease.id}
									className="bg-white p-4 rounded-lg border border-yellow-200"
								>
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-medium text-yellow-900">{disease.name}</h3>
											<p className="text-sm text-gray-600">Category: {disease.category}</p>
											<p className="text-sm text-gray-600 mt-1">{disease.description}</p>
											<p className="text-xs text-gray-500 mt-2">
												Added: {new Date(disease.created_at).toLocaleDateString()}
											</p>
										</div>
										<Badge className="bg-yellow-100 text-yellow-700">
											{disease.category}
										</Badge>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-600 text-center">No minor conditions recorded</p>
						)}
					</div>
				</Card>
			</div>

			{/* Quick Actions */}
			<div className="py-6">
				<h2 className="text-3xl font-semibold mb-4">Quick Actions</h2>
				<div className="flex justify-left gap-4">
					<Link href="/medications" className="py-2 rounded text-center">
						<Button variant="default" className="text-white">
							Add Medication Reminder
						</Button>
					</Link>
					<SymptomAnalysisDialog />
					<ChatDialog />
				</div>
			</div>

			{/* Today's Schedule */}
			<TodayMedi />
		</div>
	);
}
