"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data: hsUser, error: hsError } = await supabase
                .from("hs_users")
                .select("id, email, password")
                .eq("email", email)
                .single();

            if (hsError || !hsUser) {
                throw new Error("Invalid email or password");
            }

            const { data, error: authError } =
                await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

            if (authError) throw authError;

            toast.success("Welcome back!");
            router.push("/home");
        } catch (error) {
            toast.error("Invalid email or password");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: "google" | "apple") => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            toast.error(`Failed to login with ${provider}`);
            console.error(error);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-blue-600">
                        HealthSync
                    </CardTitle>
                    <CardDescription>
                        Your Personal Health Assistant
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleEmailLogin}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <Link
                                            href="/reset-password"
                                            className="ml-auto text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Signing in..."
                                        : "Sign in to HealthSync"}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                New to HealthSync?{" "}
                                <Link
                                    href="/signup"
                                    className="text-blue-600 hover:text-blue-800 underline underline-offset-4"
                                >
                                    Create an account
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground">
                By continuing, you agree to HealthSync's{" "}
                <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-800 underline underline-offset-4"
                >
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-800 underline underline-offset-4"
                >
                    Privacy Policy
                </Link>
                .
            </div>
        </div>
    );
}
