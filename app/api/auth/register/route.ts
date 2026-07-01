import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, password } = schema.parse(body);
    const email = schema.parse(body).email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email deja inregistrat" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const isAdmin = !!ADMIN_EMAIL && email === ADMIN_EMAIL.toLowerCase();

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        ...(isAdmin && { role: "admin", usageLimit: -1 }),
      },
    });

    // Send email verification
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.verificationToken.create({ data: { identifier: email, token, expires } });

    const baseUrl = process.env.NEXTAUTH_URL ?? "https://www.anuntai.ro";
    const verifyUrl = `${baseUrl}/ro/auth/verify-email?token=${token}`;

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "AnunțAI <onboarding@resend.dev>",
          to: [email],
          subject: "Confirmă adresa de email — AnunțAI",
          html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0a0a0f;color:#f1f5f9;border-radius:16px">
              <h1 style="font-size:24px;font-weight:800;margin-bottom:8px">Bun venit la AnunțAI!</h1>
              <p style="color:#94a3b8;margin-bottom:24px">Confirmă adresa de email pentru a-ți activa contul.</p>
              <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#d4991a,#a86f0e);color:white;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;margin-bottom:24px">
                Confirmă emailul
              </a>
              <p style="font-size:13px;color:#64748b">Link-ul expiră în 24 de ore.</p>
              <hr style="border:none;border-top:1px solid #1e293b;margin:24px 0">
              <p style="font-size:12px;color:#475569">AnunțAI · contact@anuntai.ro</p>
            </div>
          `,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}