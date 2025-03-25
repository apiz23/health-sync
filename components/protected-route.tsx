"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./loader";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { hsUser, isLoading } = useAuth();
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		if (!isLoading) {
			const storedUserId = sessionStorage.getItem("userId");

			if (!hsUser && !storedUserId) {
				router.push("/auth");
			} else if (storedUserId) {
				setIsAuthenticated(true);
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
