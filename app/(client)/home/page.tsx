"use client";

import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { IoWarningOutline, IoAlertCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Disease } from "@/interface/interface";
import SymptomAnalysisDialog from "@/components/analyze-symptoms";
import ChatDialog from "@/components/ai-chat";
import { Button } from "@/components/ui/button";
import { TodayMedi } from "@/components/today-medi";
import Loader from "@/components/loader";
import { useAuth } from "@/providers/auth-provider";
import supabase from "@/lib/supabase";

export default function Page() {
	const { hsUser, isLoading } = useAuth();
	const [userName, setUserName] = useState("");
	const [diseases, setDiseases] = useState<{
		major: Disease[];
		minor: Disease[];
	}>({ major: [], minor: [] });

	useEffect(() => {
		const storedUserId = sessionStorage.getItem("userId");

		if (hsUser) {
			setUserName(hsUser.name);
		} else if (storedUserId) {
			const fetchUserData = async () => {
				const { data } = await supabase
					.from("hs_users")
					.select("name")
					.eq("id", storedUserId)
					.single();
				if (data) setUserName(data.name);
			};
			fetchUserData();
		}

		async function fetchDiseases() {
			try {
				const userId = sessionStorage.getItem("userId");
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_NEST_API_URL}/diseases?userId=${userId}`
				);
				const data = await response.json();

				const diseasesArray = Array.isArray(data) ? data : [data];

				const categorizedDiseases = {
					major: diseasesArray.filter(
						(d) => d.classification.toLowerCase() === "major"
					),
					minor: diseasesArray.filter(
						(d) => d.classification.toLowerCase() === "minor"
					),
				};

				setDiseases(categorizedDiseases);
			} catch (error) {
				console.error("Failed to fetch diseases:", error);
			}
		}

		fetchDiseases();
	}, [hsUser]);

	if (isLoading) {
		return <Loader />;
	}
	return (
		<div className="h-fit space-y-6">
			<h1 className="scroll-m-20 text-3xl font-medium tracking-tight lg:text-4xl my-10 text-center">
				Welcome {userName ? <span className="font-bold">{userName}</span> : "Guest"}
			</h1>
			{/* Quick Actions */}
			<div className="py-6">
				<h2 className="text-3xl font-semibold mb-4">Quick Actions</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 md:gap-4">
					<Link href="/medications" className="py-2 rounded text-center">
						<Button variant="outline" className="text-black w-full bg-white">
							Add Medication Reminder
						</Button>
					</Link>
					<SymptomAnalysisDialog />
					<ChatDialog />
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Major Conditions */}
				<Card className="p-6 bg-[#A6CDC6]">
					<CardHeader className="flex items-center gap-2 mb-4">
						<IoWarningOutline className="text-red-600 w-6 h-6" />
						<h2 className="text-xl font-semibold text-[#16404D]">Major Conditions</h2>
					</CardHeader>
					<div className="space-y-3">
						{diseases.major.length > 0 ? (
							diseases.major.map((disease) => (
								<div key={disease.id} className="bg-white p-4 rounded-lg">
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-medium text-red-900">{disease.name}</h3>
											<p className="text-sm text-gray-600">
												Category: {disease.classification}
											</p>
											<p className="text-sm text-gray-600 mt-1">{disease.description}</p>
										</div>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-600 text-center">No major conditions recorded</p>
						)}
					</div>
				</Card>

				{/* Minor Conditions */}
				<Card className="p-6 bg-[#A6CDC6]">
					<CardHeader className="flex items-center gap-2 mb-4">
						<IoAlertCircleOutline className="text-yellow-600 w-6 h-6" />
						<h2 className="text-xl font-semibold text-[#16404D]">Minor Conditions</h2>
					</CardHeader>
					<div className="space-y-3">
						{diseases.minor.length > 0 ? (
							diseases.minor.map((disease) => (
								<div key={disease.id} className="bg-white p-4 rounded-lg">
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-medium text-yellow-900">{disease.name}</h3>
											<p className="text-sm text-gray-600">
												Category: {disease.classification}
											</p>
											<p className="text-sm text-gray-600 mt-1">{disease.description}</p>
										</div>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-600 text-center">No minor conditions recorded</p>
						)}
					</div>
				</Card>
			</div>

			{/* Today's Schedule */}
			<TodayMedi />
		</div>
	);
}
