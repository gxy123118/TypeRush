"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import CoinDisplay from "@/components/CoinDisplay";
import SoundToggle from "@/components/SoundToggle";

// 所有人可见
const publicLinks = [
  { href: "/", label: "练习" },
  { href: "/challenge", label: "挑战" },
  { href: "/tutorial", label: "教程" },
  { href: "/leaderboard", label: "排行榜" },
];

// 登录后才显示
const authLinks = [
  { href: "/stages", label: "闯关" },
  { href: "/shop", label: "商店" },
  { href: "/profile", label: "我的" },
];

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const coins = useGameStore((s) => s.coins);

  const navLinks = session?.user ? [...publicLinks, ...authLinks] : publicLinks;

  return (
    <header className="border-b border-white/[0.06] bg-[#1a1918]/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-amber-400 tracking-tight">
            ⌨️ TypeRush
          </Link>
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                    ? "bg-amber-500/15 text-amber-300"
                    : "text-stone-400 hover:text-stone-200 hover:bg-white/[0.04]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <SoundToggle />
          {session?.user && <CoinDisplay amount={coins} size="sm" />}
          {status === "loading" ? (
            <div className="w-16 h-8 bg-stone-800 rounded animate-pulse" />
          ) : session?.user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="text-sm text-stone-300 hover:text-white transition-colors">
                {session.user.name || session.user.email}
              </Link>
              <button
                onClick={() => signOut()}
                className="px-2.5 py-1 text-xs text-stone-400 hover:text-white border border-white/10 rounded-md hover:bg-white/[0.04] transition-colors"
              >
                退出
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="px-2.5 py-1.5 text-sm text-stone-300 hover:text-white transition-colors">
                登录
              </Link>
              <Link href="/auth/register" className="px-2.5 py-1.5 text-sm bg-amber-600 hover:bg-amber-500 text-white rounded-md transition-colors">
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
