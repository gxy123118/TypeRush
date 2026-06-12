"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { switchGameUser } from "@/store/gameStore";

/**
 * 监听登录/退出事件，按用户 id 切换 gameStore 数据
 */
export default function GameUserSync() {
  const { data: session, status } = useSession();
  const prevUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    const userId = session?.user?.id ?? null;

    // 用户变了才切换
    if (userId !== prevUserIdRef.current) {
      prevUserIdRef.current = userId;
      switchGameUser(userId);
    }
  }, [session, status]);

  return null;
}
