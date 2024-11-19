import app from "@/.";
import { db, resetDB } from "@/db";
import { Board, games } from "@/db/schema";
import { beforeAll, beforeEach, describe, expect, it } from "bun:test";


beforeAll(() => {
  // Sets up the environment for testing
  process.env.NODE_ENV = "test";
});

const uuid = crypto.randomUUID();

beforeEach(async () => {
  await resetDB();
  // Create a testing game
  await db.insert(games).values({
    uuid,
    name: "test",
    difficulty: "medium",
    gameState: "unknown",
    board: Array.from({ length: 15 }, () => Array(15).fill("")) as Board,
  });
});

function isValidUUID(uuid: string) {
  const uuidRegex =
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  return uuidRegex.test(uuid);
}

describe("API", () => {
  const baseURL = "http://localhost/api/v1";

  describe("GET /games", () => {
    it("Should return an array of games", async () => {
      const req = new Request(`${baseURL}/games`);
      const res = await app.fetch(req);

      // Tests
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(Array.isArray(body)).toBeTrue();

      // Tests if the game is valid
      const game = body[0];
      expect(isValidUUID(game.uuid)).toBeTrue();
      expect(typeof game.name).toBe("string");
      expect(["beginner", "easy", "medium", "hard", "extreme"]).toContain(
        game.difficulty,
      );
      expect(["opening", "midgame", "endgame", "unknown"]).toContain(
        game.gameState,
      );
      expect(game.board.length).toBe(15);
      expect(game.board[0].length).toBe(15);
    });
  });

  describe("POST /games", () => {
    it("Should create a new game", async () => {
      const newGame = {
        name: "Test Game",
        difficulty: "medium",
        board: Array.from({ length: 15 }, () => Array(15).fill("")),
      };

      const req = new Request(`${baseURL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGame),
      });

      // Send the request
      const res = await app.fetch(req);

      // Tests
      expect(res.status).toBe(201);

      // Test the body
      const body = await res.json();

      expect(isValidUUID(body.uuid)).toBeTrue();
      expect(body.name).toBe(newGame.name);
      expect(body.difficulty).toBe(newGame.difficulty);
      expect(new Date(body.createdAt).getTime()).not.toBeNaN();
      expect(new Date(body.updatedAt).getTime()).not.toBeNaN();
    });

    it("Should return 400 for invalid request", async () => {
      const newGame = {
        // name: "Test Game",
        difficulty: "medium",
        board: Array.from({ length: 15 }, () => Array(15).fill("")),
      };
      const req = new Request(`${baseURL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGame),
      });

      // Send the request
      const res = await app.fetch(req);

      // Tests
      expect(res.status).toBe(400);

      // Test the body
      const body = await res.json();
      expect(body.code).toBe(400);
      expect(body.message).toContain("Bad request");
    });
  });

  describe("GET /games/:uuid", () => {
    it("Should return a game", async () => {
      const req = new Request(`${baseURL}/games/${uuid}`);
      const res = await app.fetch(req);

      // Tests
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toContainKey("uuid");
      expect(body).toContainKey("name");
    });

    it("Should return a 404 for non existing uuid", async () => {
      const id = crypto.randomUUID();
      const req = new Request(`${baseURL}/games/${id}`);
      const res = await app.fetch(req);

      // Tests
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.code).toBe(404);
      expect(body.message).toBe("Resource not found");
    });
  });

  describe("PUT /games/:uuid", () => {
    it("Should update an existing game", async () => {
      const updateData = {
        difficulty: "hard",
        name: "Game #2",
      };
      const req = new Request(`${baseURL}/games/${uuid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const res = await app.fetch(req);

      // Tests
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.uuid).toEqual(uuid);
      expect(body.name).toEqual(updateData.name);
      expect(body.difficulty).toEqual(updateData.difficulty);
    });

    it("Should return 404 for updating non existing record", async () => {
      const id = crypto.randomUUID();
      const updateData = {
        difficulty: "hard",
        name: "Game #2",
      };
      const req = new Request(`${baseURL}/games/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const res = await app.fetch(req);

      // Tests
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /games/:uuid", () => {
    it("Should delete an existing record", async () => {
      const req = new Request(`${baseURL}/games/${uuid}`, {
        method: "DELETE",
      });

      const res = await app.fetch(req);

      // Tests
      expect(res.status).toBe(204);
    });

    it("Should return 404 for deleteing non existing record", async () => {
      const id = crypto.randomUUID();
      const req = new Request(`${baseURL}/games/${id}`, {
        method: "DELETE",
      });

      const res = await app.fetch(req);

      // Tests
      expect(res.status).toBe(404);
    });
  });
});