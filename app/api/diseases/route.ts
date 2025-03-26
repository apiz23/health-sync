import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ message: "User ID is required" },
				{ status: 400 }
			);
		}

		const { data, error } = await supabase
			.from("hs_diseases")
			.select("*")
			.eq("user_id", userId);

		if (error) throw new Error(error.message);

		return NextResponse.json(data, { status: 200 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error fetching diseases:", error.message);
			return NextResponse.json({ message: error.message }, { status: 500 });
		}

		return NextResponse.json(
			{ message: "An unknown error occurred" },
			{ status: 500 }
		);
	}
}
