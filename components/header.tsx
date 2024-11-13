"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Top" },
    { href: "/like", label: "Liked" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Photo Album</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <nav className="flex items-center space-x-2">
            {navLinks.map(({ href, label }) => (
              <Button
                key={href}
                variant={pathname === href ? "secondary" : "ghost"}
                asChild
                className={cn(
                  "text-base",
                  pathname === href && "bg-secondary"
                )}
              >
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          {user ? (
            <Button variant="ghost" asChild>
              <Link href="/profile">Profile</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}