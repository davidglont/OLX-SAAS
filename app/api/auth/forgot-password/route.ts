import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/db";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const { email } = schema.parse(await req.json());
    const normalized = email.toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: normalized }, select: { id: true } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email: normalized } });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email: normalized, token, expires },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/ro/auth/reset-password?token=${token}`;

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "AnunțAI <noreply@anuntai.ro>",
          to: [normalized],
          subject: "Resetare parolă AnunțAI",
          html: `
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0a0a0f;color:#f1f5f9;border-radius:16px">
              <h1 style="font-size:24px;font-weight:800;margin-bottom:8px">Resetare parolă</h1>
              <p style="color:#94a3b8;margin-bottom:24px">Am primit o cerere de resetare a parolei pentru contul tău AnunțAI.</p>
              <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#d4991a,#a86f0e);color:white;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;margin-bottom:24px">
                Resetează parola
              </a>
              <p style="font-size:13px;color:#64748b">Link-ul expiră în 1 oră. Dacă nu ai cerut resetarea, ignoră acest email.</p>
              <hr style="border:none;border-top:1px solid #1e293b;margin:24px 0">
              <p style="font-size:12px;color:#475569">AnunțAI · contact@anuntai.ro</p>
            </div>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}
