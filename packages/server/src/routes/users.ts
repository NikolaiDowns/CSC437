// packages/server/src/routes/users.ts

import express, { Request, Response } from "express";
import Users from "../services/user-svc";   // <-- your Mongoose service
// NOTE: We do NOT need to import `authenticateUser` here,
//       because you are already mounting this entire router
//       under `authenticateUser` in server/index.ts.

const router = express.Router();

/**
 * GET /api/users
 *   → return an array of all user documents
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const allUsers = await Users.index();
    return res.json(allUsers);
  } catch (err: any) {
    console.error("GET /api/users error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/users/:id
 *   → return a single user document by “id”
 *   → if no user found, return 404
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const username = req.params.id;
    const user = await Users.get(username);
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.json(user);
  } catch (err: any) {
    console.error(`GET /api/users/${req.params.id} error:`, err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/users
 *   → create a brand‐new user document
 *   → expects the full `User` shape in `req.body`
 *   → returns 201 + JSON(newUser) on success
 *   → returns 400 if the Mongoose service throws a validation error
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const newUser = await Users.create(req.body);
    return res.status(201).json(newUser);
  } catch (err: any) {
    console.error("POST /api/users error:", err);
    return res.status(400).json({ error: err.message });
  }
});

/**
 * PUT /api/users/:id
 *   → replace the entire User document with `req.body` (the full User object)
 *   → requires that (req as any).userId === req.params.id
 *   → returns 403 if someone tries to update another user’s record
 *   → returns 404 if no such user exists
 *   → otherwise returns 200 + JSON(updatedUser)
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const username = req.params.id;
    // JWT middleware (authenticateUser) should have set req.userId:
    if ((req as any).userId !== username) {
      return res.status(403).send("Forbidden: cannot edit another user");
    }

    // req.body must be the full `User` object (including shares, name, etc.)
    const updatedFields = req.body;
    const updatedUser = await Users.update(username, updatedFields);

    if (!updatedUser) {
      // If your service returns null/undefined when no user is found:
      return res.status(404).send("User not found");
    }

    // Return the newly‐updated user document:
    return res.json(updatedUser);
  } catch (err: any) {
    console.error(`PUT /api/users/${req.params.id} error:`, err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/users/:id
 *   → remove a user from the database
 *   → returns 204 on success, or 404 if no such user exists
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const username = req.params.id;
    await Users.remove(username);
    return res.status(204).end();
  } catch (err: any) {
    console.error(`DELETE /api/users/${req.params.id} error:`, err);
    return res.status(404).json({ error: err.message });
  }
});

export default router;
