"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import supabase from "@/lib/supabase";

interface AuthContextType {
	hsUser: HSUser | null;
	isLoading: boolean;
	signOut: () => Promise<void>;
}

interface HSUser {
	id: string;
	name: string;
	email: string;
}

const AuthContext = createContext<AuthContextType>({
	hsUser: null,
	isLoading: true,
	signOut: async () => {},
});

const PUBLIC_PATHS = ["/auth", "/signup", "/reset-password", "/"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const [hsUser, setHSUser] = useState<HSUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUser = async () => {
		setIsLoading(true);

		const userId = sessionStorage.getItem("userId");

		if (userId) {
			const { data, error } = await supabase
				.from("hs_users")
				.select("*")
				.eq("id", userId)
				.single();

			if (data) {
				setHSUser({
					id: data.id,
					name: data.name,
					email: data.email,
				});
			} else {
				setHSUser(null);
				sessionStorage.removeItem("userId");
			}
		} else {
			setHSUser(null);
		}

		if (!userId && !PUBLIC_PATHS.includes(pathname)) {
			router.replace("/auth");
		} else if (userId && PUBLIC_PATHS.includes(pathname)) {
			router.replace("/home");
		}

		setIsLoading(false);
	};

	useEffect(() => {
		fetchUser();
	}, [pathname]);

	const signOut = async () => {
		sessionStorage.removeItem("userId");
		setHSUser(null);
		router.replace("/auth");
	};

	return (
		<AuthContext.Provider value={{ hsUser, isLoading, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
