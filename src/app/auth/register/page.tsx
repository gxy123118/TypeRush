"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

function checkPassword(pw: string) {
  const checks = {
    length: pw.length >= 8,
    hasLetter: /[a-zA-Z]/.test(pw),
    hasNumber: /[0-9]/.test(pw),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  return { ...checks, strength: passed === 3 ? "strong" : passed === 2 ? "medium" : "weak" };
}

const inputClass =
  "w-full px-4 py-2.5 bg-[#1a1918] border border-white/[0.08] rounded-lg text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/30 transition-colors";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(false);

  const pwCheck = useMemo(() => checkPassword(password), [password]);
  const nameError = name.length > 0 && (name.trim().length < 2 || name.trim().length > 20)
    ? "用户名长度 2-20 个字符" : "";
  const confirmError = confirmPw.length > 0 && confirmPw !== password
    ? "两次输入的密码不一致" : "";

  const canSubmit =
    name.trim().length >= 2 &&
    email.includes("@") &&
    pwCheck.strength !== "weak" &&
    confirmPw === password &&
    !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldError("");

    if (confirmPw !== password) {
      setFieldError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.field) setFieldError(data.error);
        else setError(data.error || "注册失败");
        return;
      }

      const result = await signIn("credentials", { email: email.trim(), password, redirect: false });
      if (result?.error) {
        router.push("/auth/login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">注册</h1>
        <p className="text-stone-400">创建账号，追踪你的打字进步</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {(error || fieldError) && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-lg">
            {error || fieldError}
          </div>
        )}

        {/* 用户名 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-400 mb-1">
            用户名
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={20}
            className={inputClass}
            placeholder="2-20 个字符"
          />
          {nameError && <p className="text-xs text-rose-400 mt-1">{nameError}</p>}
        </div>

        {/* 邮箱 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-400 mb-1">
            邮箱
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
            placeholder="your@email.com"
          />
        </div>

        {/* 密码 */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-400 mb-1">
            密码
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
            placeholder="至少 8 个字符，包含字母和数字"
          />
          {/* 密码强度指示器 */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      pwCheck.strength === "strong" ? "bg-teal-400"
                      : pwCheck.strength === "medium" && i <= 2 ? "bg-amber-400"
                      : i <= 1 ? "bg-rose-400"
                      : "bg-stone-800"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-3 text-[11px]">
                <span className={pwCheck.length ? "text-teal-400" : "text-stone-500"}>
                  {pwCheck.length ? "✓" : "○"} 8位以上
                </span>
                <span className={pwCheck.hasLetter ? "text-teal-400" : "text-stone-500"}>
                  {pwCheck.hasLetter ? "✓" : "○"} 含字母
                </span>
                <span className={pwCheck.hasNumber ? "text-teal-400" : "text-stone-500"}>
                  {pwCheck.hasNumber ? "✓" : "○"} 含数字
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 确认密码 */}
        <div>
          <label htmlFor="confirmPw" className="block text-sm font-medium text-stone-400 mb-1">
            确认密码
          </label>
          <input
            id="confirmPw"
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            required
            className={inputClass}
            placeholder="再次输入密码"
          />
          {confirmError && <p className="text-xs text-rose-400 mt-1">{confirmError}</p>}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {loading ? "注册中..." : "注册"}
        </button>
      </form>

      <p className="text-center text-sm text-stone-500 mt-6">
        已有账号？{" "}
        <Link href="/auth/login" className="text-amber-400 hover:text-amber-300">
          登录
        </Link>
      </p>
    </div>
  );
}
