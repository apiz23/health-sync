"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
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
import { LuHospital } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Navbar() {
    const isMobile = useIsMobile();
    const router = useRouter();

    const navLinks = [
        { name: "home", path: "/home" },
        { name: "medications", path: "/medications" },
        { name: "about", path: "/about" },
        {
            name: "Logout",
            icon: IoLogOut,
            onClick: () => router.push("/auth"),
        },
    ];

    return (
        <nav className="fixed left-0 top-0 z-50 w-full border-b backdrop-blur-[12px] bg-background/70">
            <div className="max-w-5xl mx-auto flex h-[3.5rem] items-center justify-between px-4">
                <Link href="/">
                    {/* <Image
                        src={logoItc}
                        alt="logo"
                        height={48}
                        width={48}
                        className="h-14 w-14"
                    /> */}
                    <LuHospital className="h-8 w-8" />
                </Link>

                {isMobile ? (
                    <Sheet>
                        <SheetTrigger>
                            <IoMenuSharp size={40} />
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader className="flex items-center gap-2">
                                <Link href="/">
                                    {/* <Image
                                        src={logoItc}
                                        alt="logo"
                                        height={64}
                                        width={64}
                                        className="h-20 w-20"
                                    /> */}
                                    <LuHospital className="h-8 w-8" />
                                </Link>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 mt-4">
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
                                    className="font-medium capitalize"
                                >
                                    <link.icon className="h-5 w-5" />
                                    {link.name}
                                </Button>
                            ) : (
                                <Link
                                    key={index}
                                    href={link.path!}
                                    className="font-medium capitalize"
                                >
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
