import { expect } from "@playwright/test";

const MAILPIT_API_URL = "http://localhost:8025/api/v1";

interface MailpitSearch {
  messages: { ID: string }[];
}

export interface MailpitMessage {
  Subject: string;
  Text: string;
  ReplyTo: { Address: string }[];
}

const searchUrl = ({ subject }: { subject: string }): string =>
  `${MAILPIT_API_URL}/search?${new URLSearchParams({ query: `subject:"${subject}"` })}`;

const findLatest = async ({
  subject,
}: {
  subject: string;
}): Promise<MailpitMessage | undefined> => {
  const { messages } = (await (await fetch(searchUrl({ subject }))).json()) as MailpitSearch;

  const [latest] = messages;

  if (latest === undefined) {
    return undefined;
  }

  return (await (await fetch(`${MAILPIT_API_URL}/message/${latest.ID}`)).json()) as MailpitMessage;
};

export const consumeMessage = async ({ subject }: { subject: string }): Promise<MailpitMessage> => {
  await expect.poll(async () => await findLatest({ subject }), { timeout: 10_000 }).toBeDefined();

  const message = await findLatest({ subject });

  if (message === undefined) {
    throw new Error(`No email found with the subject "${subject}".`);
  }

  await fetch(searchUrl({ subject }), { method: "DELETE" });

  return message;
};
