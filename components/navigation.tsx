"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const pathname = usePathname();

  const links = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/like",
      label: "Liked",
      icon: Heart,
    },
    {
      href: "/upload",
      label: "Upload",
      icon: Upload,
    },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Button
              key={href}
              variant={pathname === href ? "secondary" : "ghost"}
              asChild
              className={cn(
                "gap-2",
                pathname === href && "bg-secondary"
              )}
            >
              <Link href={href}>
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}