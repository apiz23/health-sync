import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { userId, name, dosage, frequency, times, startDate, endDate, notes } =
			body;

		if (!userId) {
			return NextResponse.json({ error: "User ID is required" }, { status: 400 });
		}

		const { data, error } = await supabase
			.from("hs_medications")
			.insert([
				{
					user_id: userId,
					name,
					dosage,
					frequency,
					time_of_day: times,
					start_date: new Date(startDate).toISOString(),
					end_date: endDate ? new Date(endDate).toISOString() : null,
					notes: notes || null,
				},
			])
			.select()
			.single();

		if (error) throw new Error("Failed to add medication");

		return NextResponse.json({ status: 201, data });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "An unknown error occurred" },
			{ status: 500 }
		);
	}
}
