import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

const NAME_MIN = 2;
const NAME_MAX = 20;
const PASSWORD_MIN = 8;

// 密码复杂度：至少包含大写、小写、数字中的两种
function isPasswordStrong(pw: string): boolean {
  let kinds = 0;
  if (/[a-z]/.test(pw)) kinds++;
  if (/[A-Z]/.test(pw)) kinds++;
  if (/[0-9]/.test(pw)) kinds++;
  if (/[^a-zA-Z0-9]/.test(pw)) kinds++;
  return kinds >= 2;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // --- 用户名校验 ---
    if (!name || typeof name !== "string") {
      return Response.json({ error: "用户名必填", field: "name" }, { status: 400 });
    }
    const trimmedName = name.trim();
    if (trimmedName.length < NAME_MIN || trimmedName.length > NAME_MAX) {
      return Response.json({ error: `用户名长度 ${NAME_MIN}-${NAME_MAX} 个字符`, field: "name" }, { status: 400 });
    }
    if (/[<>"';&\\]/.test(trimmedName)) {
      return Response.json({ error: "用户名包含非法字符", field: "name" }, { status: 400 });
    }

    // 用户名是否已被占用
    const nameTaken = await prisma.user.findFirst({ where: { name: trimmedName } });
    if (nameTaken) {
      return Response.json({ error: "该用户名已被使用", field: "name" }, { status: 409 });
    }

    // --- 邮箱校验 ---
    if (!email || typeof email !== "string") {
      return Response.json({ error: "邮箱必填", field: "email" }, { status: 400 });
    }
    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return Response.json({ error: "邮箱格式不正确", field: "email" }, { status: 400 });
    }

    const emailTaken = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (emailTaken) {
      return Response.json({ error: "该邮箱已被注册", field: "email" }, { status: 409 });
    }

    // --- 密码校验 ---
    if (!password || typeof password !== "string") {
      return Response.json({ error: "密码必填", field: "password" }, { status: 400 });
    }
    if (password.length < PASSWORD_MIN) {
      return Response.json({ error: `密码至少 ${PASSWORD_MIN} 个字符`, field: "password" }, { status: 400 });
    }
    if (password.length > 64) {
      return Response.json({ error: "密码最长 64 个字符", field: "password" }, { status: 400 });
    }
    if (!isPasswordStrong(password)) {
      return Response.json({ error: "密码需包含字母和数字", field: "password" }, { status: 400 });
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        passwordHash,
      },
    });

    return Response.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: "注册失败，请稍后重试" }, { status: 500 });
  }
}
