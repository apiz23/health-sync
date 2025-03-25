"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Disease } from "@/interface/interface";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Page() {
	const [formData, setFormData] = useState({
		userId: "",
		name: "",
		category: "",
		classification: "minor",
		description: "",
	});
	const [diseases, setDiseases] = useState<Disease[]>([]);

	useEffect(() => {
		const storedUserId = sessionStorage.getItem("userId");
		if (storedUserId) {
			setFormData((prev) => ({ ...prev, userId: storedUserId }));
		}
	}, []);

	const fetchDiseases = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_NEST_API_URL}/diseases?userId=${formData.userId}`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch diseases.");
			}

			const data: Disease[] = await response.json();
			setDiseases(data);
		} catch (error) {
			console.error("Error fetching diseases:", error);
			toast.error("Failed to fetch diseases.");
		}
	};

	useEffect(() => {
		if (formData.userId) {
			fetchDiseases();
		}
	}, [formData.userId]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.userId || !formData.name || !formData.category) {
			alert("User ID, Name, and Category are required fields.");
			return;
		}

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_NEST_API_URL}/diseases`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				}
			);

			const text = await response.text();

			if (!response.ok) {
				throw new Error(text || "Failed to add disease.");
			}

			setFormData({
				userId: formData.userId,
				name: "",
				category: "",
				classification: "minor",
				description: "",
			});
			toast.success("Disease added successfully!");

			fetchDiseases();
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Error adding disease:", error);
				alert(error.message || "An error occurred while adding the disease.");
			} else {
				console.error("Unexpected error:", error);
				alert("An unexpected error occurred.");
			}
		}
	};

	return (
		<>
			<div className="h-fit">
				<h1 className="scroll-m-20 text-5xl md:text-6xl font-extrabold tracking-tight lg:text-5xl my-10">
					Disease List
				</h1>

				<div className="w-full flex justify-start">
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline" className="text-black bg-white">
								Add Disease
							</Button>
						</DialogTrigger>
						<DialogContent className="p-4 text-black">
							<DialogHeader>
								<DialogTitle>Add New Disease</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										name="name"
										type="text"
										placeholder="Enter Disease Name"
										value={formData.name}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="category">Category</Label>
									<Input
										id="category"
										name="category"
										type="text"
										placeholder="Enter Disease Category"
										value={formData.category}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="classification">Classification</Label>
									<RadioGroup
										value={formData.classification}
										onValueChange={(value) =>
											setFormData((prev) => ({ ...prev, classification: value }))
										}
										className="grid grid-cols-2 gap-2"
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

								<div className="space-y-2">
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										name="description"
										placeholder="Enter Disease Description (optional)"
										value={formData.description}
										onChange={handleChange}
									/>
								</div>
								<div className="flex justify-end">
									<Button type="submit" className="w-fit">
										Add Disease
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>

				{/* Disease List */}
				<div className="mt-10">
					<h2 className="text-2xl font-bold mb-4">Your Diseases</h2>
					{diseases.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{diseases.map((disease) => (
								<Card key={disease.id} className="border rounded-lg shadow bg-white">
									<Dialog>
										<CardHeader className="flex justify-between">
											<div className="text-left">
												<p>Medication Name: {disease.name}</p>
											</div>
										</CardHeader>
										<CardContent className="flex justify-end">
											<DialogTrigger>
												<Button>View</Button>
											</DialogTrigger>
										</CardContent>
										<DialogContent>
											<DialogHeader>
												<DialogTitle className="text-3xl font-medium text-gray-900">
													{disease?.name}
												</DialogTitle>
											</DialogHeader>
											<div className="flow-root">
												<dl className="divide-y divide-gray-200 text-sm">
													<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
														<dt className="font-medium text-gray-900">Category</dt>
														<dd className="text-gray-700 sm:col-span-2">
															{disease?.category}
														</dd>
													</div>
													<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
														<dt className="font-medium text-gray-900">Classification</dt>
														<dd className="text-gray-700 sm:col-span-2">
															{disease?.classification}
														</dd>
													</div>
													<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
														<dt className="font-medium text-gray-900">Description</dt>
														<dd className="text-gray-700 sm:col-span-2">
															{disease?.description || "No description available."}
														</dd>
													</div>
												</dl>
											</div>
										</DialogContent>
									</Dialog>
								</Card>
							))}
						</div>
					) : (
						<p className="text-gray-500">No diseases found.</p>
					)}
				</div>
			</div>
		</>
	);
}
