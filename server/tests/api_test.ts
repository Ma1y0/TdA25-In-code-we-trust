import { describe, it, expect, test } from "bun:test";
import app from "@/.";

test("/ Should return index.html and 200 OK", async () => {
  const req = new Request("http://localhost/");
  const res = await app.fetch(req);

  expect(res.status).toBe(200);
  expect(await res.text()).not.toHaveLength(0);
});

describe("api", () => {
  it("/api Should return JSON and 200 OK", async () => {
    const req = new Request("http://localhost/api");
    const res = await app.fetch(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ organization: "Student Cyber Games" });
  });
});
