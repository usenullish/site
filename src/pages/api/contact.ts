import type { APIRoute } from "astro";
import { z } from "astro/zod";
import { contactResponse, type ContactStatus } from "../../lib/contact.ts";
import { NULLISH_SITE_MAIL_ADDRESS, NULLISH_SITE_MAIL_SMTP_URL } from "astro:env/server";
import { createTransport } from "nodemailer";
import { isEmptyString } from "../../utils/nullish.utils.ts";

export const prerender = false;

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email().trim().max(320),
  company: z.string().trim().max(200).default(""),
  plan: z.enum(["tester", "instance", "on-prem"]),
  message: z.string().trim().max(5000).default(""),
});

const send = async ({
  name,
  email,
  company,
  plan,
  message,
}: z.infer<typeof ContactSchema>): Promise<void> => {
  const mailAddress = NULLISH_SITE_MAIL_ADDRESS;
  const smtpUrl = NULLISH_SITE_MAIL_SMTP_URL;

  if (isEmptyString(mailAddress) || isEmptyString(smtpUrl)) {
    throw new Error(
      "The contact form is not configured: NULLISH_SITE_MAIL_* environment variables are missing.",
    );
  }

  const transporter = createTransport(smtpUrl);

  const text = [
    `Plan: ${plan}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company}`,
    "",
    message,
  ].join("\n");

  const subject = `[nullish::contact] ${plan} request`;

  await transporter.sendMail({
    from: mailAddress,
    to: mailAddress,
    replyTo: email,
    subject,
    text,
  });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  const back = (status: ContactStatus) => contactResponse({ request, form, status, redirect });

  if (`${form.get("website") ?? ""}` !== "") {
    return back("sent");
  }

  const parsed = ContactSchema.safeParse(Object.fromEntries(form));

  if (!parsed.success) {
    return back("error");
  }

  try {
    await send(parsed.data);
  } catch (err: unknown) {
    console.error(err);
    return back("error");
  }

  return back("sent");
};
