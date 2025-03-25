"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	const isAuthenticated = false;

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/auth");
		}
	}, [isAuthenticated, router]);

	return null;
}
