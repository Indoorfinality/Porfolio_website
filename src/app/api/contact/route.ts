import { NextResponse } from "next/server";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

const CONTACT_TO = process.env.CONTACT_TO_EMAIL || "anushnachaulagain@gmail.com";

const emailOk = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 120;

async function sendWithResend(payload: {
  name: string;
  email: string;
  message: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return null;

  const from =
    process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [CONTACT_TO],
      reply_to: payload.email,
      subject: `Portfolio contact from ${payload.name}`,
      text: `From: ${payload.name} <${payload.email}>\n\n${payload.message}`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Resend error:", detail);
    throw new Error("Resend failed");
  }

  return "resend" as const;
}

/** Free path — delivers to Gmail after one-time FormSubmit activation. */
async function sendWithFormSubmit(payload: {
  name: string;
  email: string;
  message: string;
}) {
  const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_TO}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      message: payload.message,
      _replyto: payload.email,
      _subject: `Portfolio contact from ${payload.name}`,
      _template: "table",
      _captcha: "false",
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    success?: string | boolean;
    message?: string;
  };

  if (!res.ok) {
    console.error("FormSubmit error:", data);
    throw new Error("FormSubmit failed");
  }

  return {
    provider: "formsubmit" as const,
    note:
      typeof data.message === "string" && data.message.toLowerCase().includes("activate")
        ? "Check your inbox (and spam) for a FormSubmit activation email, then try again."
        : undefined,
  };
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
  }
  if (!emailOk(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 2000) {
    return NextResponse.json(
      { error: "Message should be between 10 and 2000 characters." },
      { status: 400 },
    );
  }

  try {
    const viaResend = await sendWithResend({ name, email, message });
    if (viaResend) {
      return NextResponse.json({ ok: true });
    }

    const viaForm = await sendWithFormSubmit({ name, email, message });
    return NextResponse.json({
      ok: true,
      ...(viaForm.note ? { note: viaForm.note } : {}),
    });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json(
      {
        error: `Could not send to ${CONTACT_TO}. Try emailing directly.`,
      },
      { status: 502 },
    );
  }
}
