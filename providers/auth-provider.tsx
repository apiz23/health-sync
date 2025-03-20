"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";
import supabase from "@/lib/supabase";

interface AuthContextType {
    user: User | null;
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
    user: null,
    hsUser: null,
    isLoading: true,
    signOut: async () => {},
});

const PUBLIC_PATHS = ["/auth", "/signup", "/reset-password", "/"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [hsUser, setHSUser] = useState<HSUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isPublicRoute = PUBLIC_PATHS.includes(pathname!);

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (session?.user && mounted) {
                    setUser(session.user);
                    const { data } = await supabase
                        .from("hs_users")
                        .select("id, name, email")
                        .eq("email", session.user.email)
                        .single();

                    if (mounted && data) {
                        setHSUser(data);
                        sessionStorage.setItem("userId", data.id);
                        setIsLoading(false);
                    }
                } else {
                    if (mounted) {
                        setUser(null);
                        setHSUser(null);

                        sessionStorage.removeItem("userId");
                        setIsLoading(false);

                        if (!isPublicRoute) {
                            router.push("/auth");
                        }
                    }
                }
            } catch (error) {
                console.error("Error initializing auth:", error);
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        initializeAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user && mounted) {
                setUser(session.user);
                const { data } = await supabase
                    .from("hs_users")
                    .select("id, name, email")
                    .eq("email", session.user.email)
                    .single();

                if (mounted && data) {
                    setHSUser(data);
                    sessionStorage.setItem("userId", data.id);
                }
            } else {
                if (mounted) {
                    setUser(null);
                    setHSUser(null);
                    sessionStorage.removeItem("userId");

                    if (!isPublicRoute) {
                        router.push("/auth");
                    }
                }
            }
        });

        const storedUserId = sessionStorage.getItem("userId");
        if (storedUserId && !hsUser) {
            supabase
                .from("hs_users")
                .select("id, name, email")
                .eq("id", storedUserId)
                .single()
                .then(({ data }) => {
                    if (mounted && data) {
                        setHSUser(data);
                    }
                });
        }

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [pathname, router, isPublicRoute, hsUser]);

    if (isLoading && !isPublicRoute && !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                hsUser,
                isLoading,
                signOut: async () => {
                    setIsLoading(true);
                    await supabase.auth.signOut();
                    sessionStorage.removeItem("userId");
                    router.push("/auth");
                    setIsLoading(false);
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
