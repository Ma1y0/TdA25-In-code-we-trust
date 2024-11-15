import { describe, it, expect, beforeAll, beforeEach } from "bun:test";
import app from "@/.";
import { db, resetDB } from "@/db";
import { eq } from "drizzle-orm";
import { games } from "@/db/schema";

beforeAll(() => {
  // Sets up the environment for testing
  process.env.NODE_ENV = "test";
});

beforeEach(() => {
  resetDB();
});

describe("/", () => {
  it("Should return index.html and 200 OK", async () => {
    const req = new Request("http://localhost/");
    const res = await app.fetch(req);

    // Tests
    expect(res.status).toBe(200);
    expect(await res.text()).not.toHaveLength(0);
  });
});

describe("/api", () => {
  it("Should return JSON and 200 OK on GET", async () => {
    const req = new Request("http://localhost/api");
    const res = await app.fetch(req);

    // Tests
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ organization: "Student Cyber Games" });
  });
});

// describe("/api/game", () => {
//   it("Should create a new game record on POST", async () => {
//     const req = new Request("http://localhost/api/game", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         name: "Test",
//         difficulty: "easy",
//       }),
//     });
//     const res = await app.fetch(req);
//     const json = await res.json();
//     const record = await db.query.games.findFirst({
//       where: eq(games.uuid, json.uuid),
//     });
//
//     // Tests
//     expect(record).not.toBeUndefined();
//     expect(res.status).toBe(201);
//     expect(json).toEqual(record);
//   });
// });
