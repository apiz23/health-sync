"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MedicationForm } from "./medication-form";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

interface MedicationLog {
    id: string;
    scheduled_time: string;
    taken_time: string | null;
    status: "pending" | "taken" | "missed";
}

interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    time_of_day: string[];
    start_date: string;
    end_date: string | null;
    notes: string | null;
    created_at: string;
    user_id: string;
}

export function MedicationList() {
    const { hsUser } = useAuth();
    const [medications, setMedications] = useState<Medication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMedications() {
            const userId = hsUser?.id || sessionStorage.getItem("userId");

            if (!userId) {
                console.warn("User ID not found");
                setIsLoading(false);
                return;
            }

            try {
                console.log("Fetching Medications for User:", userId);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_NEST_API_URL}/medications?userId=${userId}`
                );
                console.log(response);
                const responseData = await response.json();

                if (Array.isArray(responseData.data)) {
                    setMedications(responseData.data);
                } else {
                    setMedications([]);
                }
            } catch (error) {
                console.error("Error fetching medications:", error);
                toast.error("Failed to load medications");
                setMedications([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMedications();
    }, [hsUser?.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        );
    }

    const userId = hsUser?.id || sessionStorage.getItem("userId");
    if (!userId) {
        return (
            <div className="text-center p-4 text-gray-500">
                Please log in to view medications
            </div>
        );
    }

    if (medications.length === 0) {
        return (
            <div className="text-center p-4 text-gray-500">
                No medications found. Add your first medication to get started.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <MedicationForm />
            </div>

            {medications.map((medication) => (
                <Card key={medication.id} className="p-4 space-y-3">
                    <Dialog>
                        <div className="flex justify-between">
                            <div className="flex flex-col justify-start text-left">
                                <p>Medication Name: {medication.name}</p>
                                <p>Frequency: {medication.frequency}</p>
                            </div>
                            <DialogTrigger asChild>
                                <div>
                                    <Button>View More</Button>
                                </div>
                            </DialogTrigger>
                        </div>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Details</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">
                                        {medication.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Dosage: {medication.dosage}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Frequency: {medication.frequency}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Start Date:{" "}
                                        {new Date(
                                            medication.start_date
                                        ).toLocaleDateString()}
                                    </p>
                                    {medication.end_date && (
                                        <p className="text-sm text-gray-600">
                                            End Date:{" "}
                                            {new Date(
                                                medication.end_date
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">
                                    Scheduled Times:
                                </h4>
                                {medication.time_of_day.map((time, index) => (
                                    <div key={index} className="flex gap-2">
                                        <p className="text-sm">{time}</p>
                                    </div>
                                ))}
                            </div>
                            <DialogFooter>
                                <DialogClose>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Card>
            ))}
        </div>
    );
}
