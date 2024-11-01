import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.use(logger());

app.use("/*", serveStatic({ root: "./client" }));
app.get("*", serveStatic({ path: "./client/index.html" }));

export default {
  port: 80,
  fetch: app.fetch,
};
