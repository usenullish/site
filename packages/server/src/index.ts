import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
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
