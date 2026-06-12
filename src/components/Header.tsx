"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "练习" },
  { href: "/tutorial", label: "教程" },
  { href: "/challenge", label: "挑战" },
  { href: "/history", label: "历史" },
  { href: "/leaderboard", label: "排行榜" },
];

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <header className="border-b border-white/10 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-emerald-400 tracking-tight">
            ⌨️ TypeRush
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-16 h-8 bg-gray-800 rounded animate-pulse" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">
                {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-white/10 rounded-md hover:bg-white/5 transition-colors"
              >
                退出
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
              >
                登录
              </Link>
              <Link
                href="/auth/register"
                className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
              >
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
