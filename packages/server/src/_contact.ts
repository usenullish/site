import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";
import { createTransport } from "nodemailer";

const ContactRequestSchema = z.strictObject({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().max(320).pipe(z.email()),
  company: z.string().trim().max(200).default(""),
  plan: z.enum(["tester", "instance", "on-prem"]),
  message: z.string().trim().max(5000).default(""),
  website: z.string().optional(),
});

const ContactResponseSchema = z.strictObject({
  status: z.enum(["sent", "error"]),
});

const LimitedResponseSchema = z.strictObject({
  status: z.literal("limited"),
});

type Contact = z.infer<typeof ContactRequestSchema>;

export const contactRoute = createRoute({
  method: "post",
  path: "/api/contact",
  request: {
    body: {
      content: {
        "application/x-www-form-urlencoded": { schema: ContactRequestSchema },
        "multipart/form-data": { schema: ContactRequestSchema },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: ContactResponseSchema } },
      description: "The contact request was sent",
    },
    400: {
      content: { "application/json": { schema: ContactResponseSchema } },
      description: "The contact request is invalid",
    },
    429: {
      content: { "application/json": { schema: LimitedResponseSchema } },
      description: "Too many contact requests from this client",
    },
    500: {
      content: { "application/json": { schema: ContactResponseSchema } },
      description: "The contact request could not be sent",
    },
  },
});

const send = async ({ name, email, company, plan, message }: Contact): Promise<void> => {
  const from = process.env.NULLISH_SITE_MAIL_FROM;
  const to = process.env.NULLISH_SITE_MAIL_TO;
  const smtpUrl = process.env.NULLISH_SITE_MAIL_SMTP_URL;

  if (from === undefined || from === "") {
    throw new Error("NULLISH_SITE_MAIL_FROM must be set.");
  }

  if (to === undefined || to === "") {
    throw new Error("NULLISH_SITE_MAIL_TO must be set.");
  }

  if (smtpUrl === undefined || smtpUrl === "") {
    throw new Error("NULLISH_SITE_MAIL_SMTP_URL must be set.");
  }

  const text = [
    `Plan: ${plan}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company}`,
    "",
    message,
  ].join("\n");

  await createTransport(smtpUrl).sendMail({
    from,
    to,
    replyTo: email,
    subject: `[nullish] ${plan}: ${name}`,
    text,
  });
};

export const contactHandler: RouteHandler<typeof contactRoute> = async (c) => {
  const body = c.req.valid("form");

  if (body.website !== undefined && body.website !== "") {
    return c.json({ status: "sent" as const }, 200);
  }

  try {
    await send(body);
  } catch (err: unknown) {
    console.error(err);
    return c.json({ status: "error" as const }, 500);
  }

  return c.json({ status: "sent" as const }, 200);
};
