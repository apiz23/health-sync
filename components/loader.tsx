import { LoaderCircle } from "lucide-react";
import React from "react";

export default function Loader() {
	return (
		<div className="min-h-screen flex justify-center items-center pt-20">
			<LoaderCircle className="animate-spin h-14 w-14" />
		</div>
	);
}
