import { MedicationForm } from "@/components/medication-form";
import { MedicationList } from "@/components/medication-list";
import React from "react";

export default function Page() {
    return (
        <>
            <div className="h-screen">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl  mb-5">
                    Medication List
                </h1>
                <MedicationList />
            </div>
        </>
    );
}
