"use server";

import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json({ error: "User ID is required" }, { status: 400 });
		}

		const { data, error } = await supabase
			.from("hs_medications")
			.select("*")
			.eq("user_id", userId)
			.order("start_date", { ascending: true });

		if (error) throw new Error("Failed to fetch medications");

		return NextResponse.json({ status: 200, data });
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

export async function DELETE(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const medicationId = searchParams.get("id");

		if (!medicationId) {
			return NextResponse.json(
				{ error: "Medication ID is required" },
				{ status: 400 }
			);
		}

		const { error } = await supabase
			.from("hs_medications")
			.delete()
			.eq("id", medicationId);
		if (error) throw new Error("Failed to delete medication");

		return NextResponse.json({ status: 200, message: "Medication deleted" });
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

export async function PATCH(req: Request) {
	try {
		const body = await req.json();
		const { id, updates } = body;

		if (!id || !updates) {
			return NextResponse.json(
				{ error: "ID and updates required" },
				{ status: 400 }
			);
		}

		const { data, error } = await supabase
			.from("hs_medications")
			.update(updates)
			.eq("id", id)
			.select()
			.single();

		if (error) throw new Error("Failed to update medication");

		return NextResponse.json({ status: 200, data });
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
