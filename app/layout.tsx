import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/auth-provider";

const poppins = Poppins({ subsets: ["latin"], weight: ["500"] });

export const metadata: Metadata = {
	title: "HealthCare AI",
	description: "Your personal health assistant",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.className}`}>
				<Toaster />
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
