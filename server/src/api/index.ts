import { Hono } from "hono";

export const api = new Hono();

api.get("/", (e) => {
  return e.json({ organization: "Student Cyber Games" });
});
