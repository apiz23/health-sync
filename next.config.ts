import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// Initialize the PWA configuration
const withPWA = withPWAInit({
	dest: "public", // Destination directory for PWA files
});

// Define your Next.js configuration
const nextConfig: NextConfig = {
	reactStrictMode: true, // Example: Enable React Strict Mode
	// Add other Next.js config options here
};

// Conditionally wrap the Next.js config with the PWA plugin
const isDevelopment = process.env.NODE_ENV === "development";

export default isDevelopment ? nextConfig : withPWA(nextConfig);
