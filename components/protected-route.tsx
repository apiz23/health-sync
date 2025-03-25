"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "./loader";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { hsUser, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			const storedUserId = sessionStorage.getItem("userId");

			if (!hsUser && !storedUserId) {
				router.push("/auth");
			}
		}
	}, [hsUser, isLoading, router]);

	if (isLoading) {
		return <Loader />;
	}

	if (!hsUser && !sessionStorage.getItem("userId")) {
		return null;
	}

	return <>{children}</>;
}
