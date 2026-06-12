"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="text-5xl">🔒</div>
        <h2 className="text-xl font-bold text-white">需要登录</h2>
        <p className="text-stone-400 text-sm">登录后才能使用此功能</p>
        <div className="flex gap-3">
          <Link
            href="/auth/login"
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
          >
            登录
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg font-medium transition-colors"
          >
            注册
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
