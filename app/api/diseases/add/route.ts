import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
	try {
		const { userId, name, category, classification, description } =
			await req.json();

		if (!userId || !name || !category) {
			return NextResponse.json(
				{ message: "User ID, Name, and Category are required" },
				{ status: 400 }
			);
		}

		const { data, error } = await supabase.from("hs_diseases").insert([
			{
				user_id: userId,
				name,
				category,
				classification,
				description,
			},
		]);

		if (error) throw new Error(error.message);

		return NextResponse.json(data, { status: 201 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error adding disease:", error.message);
			return NextResponse.json({ message: error.message }, { status: 500 });
		}

		return NextResponse.json(
			{ message: "An unknown error occurred" },
			{ status: 500 }
		);
	}
}
