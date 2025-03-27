import React from "react";

export default function Page() {
	return (
		<div className="h-fit px-4 md:px-10 lg:px-20 py-8">
			{/* Title */}
			<div className="text-center mb-10">
				<h1 className="scroll-m-20 text-5xl md:text-6xl font-extrabold tracking-tight lg:text-5xl my-10">
					About This Project
				</h1>
			</div>

			{/* Introduction */}
			<section className="mb-10">
				<h2 className="text-3xl font-bold mb-4">Introduction</h2>
				<p className="text-lg">
					This project is designed to provide a comprehensive solution for managing
					personal health and wellness. It focuses on helping users track their
					medications, monitor their health conditions, and stay organized with
					reminders and schedules. The goal is to empower individuals to take control
					of their health in a simple and efficient way.
				</p>
			</section>

			{/* Key Features */}
			<section className="mb-10">
				<h2 className="text-3xl font-bold mb-4">Key Features</h2>
				<ul className="list-disc pl-6 text-lg space-y-2">
					<li>
						<strong>Medication Reminders:</strong> Set up personalized reminders for
						taking medications at specific times.
					</li>
					<li>
						<strong>Disease Management:</strong> Track and manage health conditions by
						associating medications with specific diseases.
					</li>
					<li>
						<strong>Customizable Schedules:</strong> Create flexible schedules with
						options for daily, weekly, or custom frequencies.
					</li>
					<li>
						<strong>Health Insights:</strong> Gain insights into your medication
						habits and health trends over time.
					</li>
					<li>
						<strong>User-Friendly Interface:</strong> A clean and intuitive design
						ensures ease of use for all users.
					</li>
				</ul>
			</section>

			{/* Technologies Used */}
			<section className="mb-10">
				<h2 className="text-3xl font-bold mb-4">Technologies Used</h2>
				<p className="text-lg mb-4">
					This project leverages modern technologies to deliver a seamless user
					experience:
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
					<div className="bg-[#FCFFE7] p-6 rounded-lg shadow-md">
						<h3 className="text-xl font-semibold mb-2">Frontend</h3>
						<ul className="list-disc pl-6">
							<li>Next.js</li>
							<li>Tailwind CSS</li>
							<li>Shadcn UI Components</li>
						</ul>
					</div>
					<div className="bg-[#FCFFE7] p-6 rounded-lg shadow-md">
						<h3 className="text-xl font-semibold mb-2">Backend</h3>
						<ul className="list-disc pl-6">
							<li>FastAPI</li>
							<li>Next.js API</li>
						</ul>
					</div>
				</div>
			</section>

			{/* Conclusion */}
			<section className="text-center">
				<h2 className="text-3xl font-bold mb-4">Conclusion</h2>
				<p className="text-lg">
					This project aims to simplify health management by providing a robust and
					user-friendly platform. Whether you{"'"}re managing chronic conditions or
					simply staying on top of your daily health routines, this application is
					designed to support you every step of the way. We are committed to
					continuous improvement and welcome feedback to make this tool even better.
				</p>
			</section>
		</div>
	);
}
