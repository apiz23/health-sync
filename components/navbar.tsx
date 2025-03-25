"use client";

import Link from "next/link";
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetClose,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useMobile";
import { IoMenuSharp, IoLogOut } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "@/providers/auth-provider";

export default function Navbar() {
	const isMobile = useIsMobile();
	const router = useRouter();
	const { signOut } = useAuth();

	const handleLogout = async () => {
		await signOut();
		router.push("/auth");
	};

	const navLinks = [
		{ name: "home", path: "/home" },
		{ name: "diseases", path: "/diseases" },
		{ name: "medications", path: "/medications" },
		{ name: "about", path: "/about" },
		{
			name: "Logout",
			icon: IoLogOut,
			onClick: handleLogout,
		},
	];

	return (
		<nav className="fixed left-0 top-0 z-50 w-full shadow shadow-neutral-700 backdrop-blur-[12px]">
			<div className="max-w-5xl mx-auto flex h-[3.5rem] items-center justify-between px-4">
				<Link href="/" className="text-2xl">
					HS
				</Link>

				{isMobile ? (
					<Sheet>
						<SheetTrigger>
							<IoMenuSharp size={40} />
						</SheetTrigger>
						<SheetContent className="text-black rounded-s-xl bg-neutral-200">
							<SheetHeader className="flex items-center gap-2">
								<Link href="/" className="text-2xl">
									HS
								</Link>
								<SheetTitle>Menu</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col gap-4 mt-4 p-4">
								{navLinks.map((link, index) => (
									<SheetClose asChild key={index}>
										{link.onClick ? (
											<Button
												variant="outline"
												className="px-2 text-lg font-medium capitalize justify-start"
												onClick={link.onClick}
											>
												{link.name}
											</Button>
										) : (
											<Link
												href={link.path!}
												className="px-2 text-lg font-medium capitalize"
											>
												{link.name}
											</Link>
										)}
									</SheetClose>
								))}
							</div>
						</SheetContent>
					</Sheet>
				) : (
					<div className="flex items-center gap-4">
						{navLinks.map((link, index) =>
							link.onClick ? (
								<Button
									key={index}
									variant="outline"
									onClick={link.onClick}
									className="font-medium capitalize text-black"
								>
									<link.icon className="h-5 w-5" />
									{link.name}
								</Button>
							) : (
								<Link key={index} href={link.path!} className="font-medium capitalize">
									{link.name}
								</Link>
							)
						)}
					</div>
				)}
			</div>
		</nav>
	);
}
