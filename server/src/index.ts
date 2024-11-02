import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { api } from "@/api";

const app = new Hono();

app.use(logger());

// The API routes
app.route("/api", api);

// The static page
app.get("/", serveStatic({ path: "./client/index.html" }));
app.use("/*", serveStatic({ root: "./client" }));

export default {
  port: process.env.PORT ?? 80,
  fetch: app.fetch,
};
