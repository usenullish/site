import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { contactHandler, contactRoute } from "./_contact.ts";
import pkg from "../package.json" with { type: "json" };
import rootPkg from "../../../package.json" with { type: "json" };

const { name: title } = pkg;
const { version } = rootPkg;

const app = new OpenAPIHono();

app.openapi(contactRoute, contactHandler);

app.doc("/api/doc", {
  openapi: "3.0.0",
  info: {
    version,
    title,
  },
  security: [{ ApiKey: [] }],
});

const port = Number(process.env.PORT ?? 3000);
const hostname = process.env.HOST ?? "127.0.0.1";

const apiServer = serve({ fetch: app.fetch, port, hostname }, ({ address, port }) => {
  console.log(`Listening on http://${address}:${port}`);
});

const close = () => {
  apiServer.close((err) => {
    if (err !== undefined) {
      console.error("Cannot close the API:", err);
      process.exit(1);
    }

    process.exit(0);
  });
};

process.on("SIGINT", close);
process.on("SIGTERM", close);
