// packages/server/src/routes/users.ts

import express, { Request, Response } from "express";
import { User } from "../models/user";
import Users from "../services/user-svc";
import { authenticateUser } from "./auth";

const router = express.Router();

// GET  /api/users           → list all users
router.get("/", (_req, res) =>
  Users.index()
    .then((all) => res.json(all))
    .catch((err) => res.status(500).send(err))
);

// GET  /api/users/:id       → fetch one user
router.get("/:id", (req, res) =>
  Users.get(req.params.id)
    .then((u) => u ? res.json(u) : res.status(404).end())
    .catch(() => res.status(500).end())
);

// POST /api/users           → create a new user
router.post("/", (req: Request, res) =>
  Users.create(req.body as User)
    .then((u) => res.status(201).json(u))
    .catch((err) => res.status(400).send(err))
);

// PUT  /api/users/:id       → update an existing user
router.put("/:id", (req: Request, res) =>
  Users.update(req.params.id, req.body as User)
    .then((u) => res.json(u))
    .catch((err) => res.status(404).send(err))
);

// DELETE /api/users/:id     → remove a user
router.delete("/:id", (req, res) =>
  Users.remove(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err))
);

router.get(
  "/me",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const username = (req as any).userId as string;
      const user     = await Users.get(username);
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
