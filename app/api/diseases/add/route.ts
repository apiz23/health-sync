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

		if (error) throw error;

		return NextResponse.json(data, { status: 201 });
	} catch (error: any) {
		console.error("Error adding disease:", error.message);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
