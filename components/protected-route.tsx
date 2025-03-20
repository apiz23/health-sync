"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { hsUser, isLoading } = useAuth();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check both hsUser and sessionStorage
        const storedUserId = sessionStorage.getItem("userId");

        if (!hsUser && !storedUserId) {
            router.push("/auth");
        } else if (storedUserId) {
            setIsAuthenticated(true);
        }
    }, [hsUser, router]);

    // Show loading state only during initial load
    if (isLoading && !sessionStorage.getItem("userId")) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    // Allow render if either hsUser exists or we have a stored userId
    if (!hsUser && !sessionStorage.getItem("userId")) {
        return null;
    }

    return <>{children}</>;
}
