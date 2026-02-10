"use client";

import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 bg-[#060B1A]/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          HireAI
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <Link href="/#features" className="hover:text-cyan-400 transition-colors">Features</Link>
            <Link href="/#pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href={(session.user as any)?.role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard"} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-white/20 overflow-hidden p-0 hover:bg-white/10">
                      {session?.user?.image ? (
                        <img src={session.user.image} alt={session.user.name || "User"} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold">
                          {session?.user?.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session?.user?.name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session?.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer w-full flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer w-full flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-cyan-500/20">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
