"use server";

import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
	try {
		const url = new URL(req.url);
		const id = url.pathname.split("/").pop(); 

		if (!id) {
			return NextResponse.json(
				{ error: "Disease ID is required" },
				{ status: 400 }
			);
		}

		const { error } = await supabase.from("hs_diseases").delete().eq("id", id);

		if (error) throw new Error("Failed to delete disease");

		return NextResponse.json(
			{ message: "Disease deleted successfully" },
			{ status: 200 }
		);
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
