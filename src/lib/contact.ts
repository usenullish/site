const LANGUAGES = ["en", "de", "fr", "it"] as const;

const PAGES: Record<string, string> = {
  tester: "contact/become-a-tester",
  instance: "contact/instance",
  "on-prem": "contact/on-prem",
};

export type ContactStatus = "sent" | "error" | "limit";

export const contactRedirectPath = ({
  form,
  status,
}: {
  form: FormData;
  status: ContactStatus;
}): string => {
  const lang = LANGUAGES.find((value) => value === form.get("lang")) ?? "en";
  const page = PAGES[`${form.get("plan")}`] ?? PAGES.tester;

  return `/${lang}/${page}/?status=${status}#contact-form`;
};

const HTTP_STATUS: Record<ContactStatus, number> = { sent: 200, error: 400, limit: 429 };

export const contactResponse = ({
  request,
  form,
  status,
  redirect,
}: {
  request: Request;
  form: FormData;
  status: ContactStatus;
  redirect: (path: string, status: 303) => Response;
}): Response =>
  request.headers.get("accept")?.includes("application/json")
    ? Response.json({ status }, { status: HTTP_STATUS[status] })
    : redirect(contactRedirectPath({ form, status }), 303);
