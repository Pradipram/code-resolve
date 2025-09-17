"use client";
import { useClerk, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/modeToggle";

const Header = () => {
  const { isSignedIn } = useClerk();

  return (
    <header className="flex items-center justify-between p-2 bg-gray-800 shadow-md border-b-2 border-white">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/images/logo_white.png"
            alt="Logo"
            width={50}
            height={50}
          />
        </Link>
        <div>
          <Link href="/dashboard">
            <Button variant={"link"} className="text-white">
              Dashboard
            </Button>
          </Link>
          <Link href="/progress">
            <Button variant={"link"} className="text-white">
              Progress
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4 ">
        <ModeToggle />
        {isSignedIn ? (
          <UserButton signInUrl="/sign-in" />
        ) : (
          <Link href="/sign-in">
            <Button variant={"outline"}>Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
