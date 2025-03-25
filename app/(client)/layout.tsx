import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";

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
			<body>
				<ProtectedRoute>
					<Navbar />
					<main className="max-w-5xl mx-auto px-4 py-20">{children}</main>
				</ProtectedRoute>
			</body>
		</html>
	);
}
