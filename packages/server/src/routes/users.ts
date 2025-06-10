// packages/server/src/routes/users.ts

import express, { Request, Response } from "express";
import Users, { UserModel } from "../services/user-svc";
import { DataShare } from "../models/user";

const router = express.Router();


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
 *  return a single user document by “id”
 *  if no user found, return 404
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
 *   create a brand‐new user document
 *   expects the full User shape in req.body
 *   returns 201 + JSON(newUser) on success
 *   returns 400 if validation fails
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
 *   replace the entire User document with req.body (the full User object)
 *   requires that (req as any).userId === req.params.id
 *   returns 403 if someone tries to update another user’s record
 *   returns 404 if no such user exists
 *   otherwise returns 200 + JSON(updatedUser)
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const username = req.params.id;

    // JWT middleware (authenticateUser) should have set req.userId:
    if ((req as any).userId !== username) {
      return res.status(403).send("Forbidden: cannot edit another user");
    }

    // req.body must be the full User object (including shares, receives, name, etc.)
    const updatedFields = req.body;
    const updatedUser = await Users.update(username, updatedFields);

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    return res.json(updatedUser);
  } catch (err: any) {
    console.error(`PUT /api/users/${req.params.id} error:`, err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/users/:id
 *   remove a user from the database
 *   returns 204 on success, or 404 if no such user exists
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

/**
 * POST /api/users/:id/share
 *   “id” is the sharer’s username (the logged‐in user’s ID)
 *   expects at least { withUserId: string, mode: "temporary"|"indefinite", sharedAt?: string, expiresAt?: string }
 *   if mode is missing or invalid, defaults to "indefinite"
 *   pushes one DataShare record into sharer.shares[]
 *   pushes a corresponding DataShare record into recipient.receives[]
 *   requires that (req as any).userId === req.params.id
 *   returns 200 + JSON(updatedSharer) on success
 */
router.post("/:id/share", async (req: Request, res: Response) => {
  try {
    const sharerId = req.params.id;

    // Ensure the logged‐in user is sharing from their own account:
    if ((req as any).userId !== sharerId) {
      return res.status(403).send("Forbidden: cannot share from another user");
    }

    // Log the raw body so we can inspect it if something goes wrong:
    console.log("Incoming /share body:", JSON.stringify(req.body, null, 2));

    // Pull out fields (they may or may not have provided mode/sharedAt/expiresAt):
    let { withUserId, mode, sharedAt, expiresAt } = req.body as Partial<DataShare>;

    // Validate that `withUserId` is a non‐empty string:
    if (typeof withUserId !== "string" || withUserId.trim() === "") {
      return res.status(400).send("Invalid DataShare: missing withUserId");
    }

    // If they gave a valid mode "temporary", keep it; otherwise default to "indefinite":
    let shareMode: "temporary" | "indefinite" =
      mode === "temporary" ? "temporary" : "indefinite";

    // Parse sharedAt if valid ISO date, else use now:
    let sharedAtDate: Date;
    if (typeof sharedAt === "string" && !isNaN(Date.parse(sharedAt))) {
      sharedAtDate = new Date(sharedAt);
    } else {
      sharedAtDate = new Date();
    }

    // If “temporary” and they provided a valid expiresAt, parse it; otherwise undefined:
    let expiresAtDate: Date | undefined = undefined;
    if (
      shareMode === "temporary" &&
      typeof expiresAt === "string" &&
      !isNaN(Date.parse(expiresAt))
    ) {
      expiresAtDate = new Date(expiresAt);
    }

    // Build the outgoing share record for sharer.shares[]:
    const outgoingShare: DataShare = {
      withUserId: withUserId.trim(),
      mode: shareMode,
      sharedAt: sharedAtDate,
      expiresAt: expiresAtDate,
    };

    // Push it into the sharer’s shares[]:
    const updatedSharer = await UserModel.findOneAndUpdate(
      { id: sharerId },
      { $push: { shares: outgoingShare } },
      { new: true }
    ).exec();

    if (!updatedSharer) {
      return res.status(404).send(`Sharer user "${sharerId}" not found`);
    }

    // Build the “reverse” DataShare for recipient.receives[]:
    const incomingForRecipient: DataShare = {
      withUserId: sharerId,
      mode: shareMode,
      sharedAt: sharedAtDate,
      expiresAt: expiresAtDate,
    };

    // Push that into the recipient’s receives[]:
    const updatedRecipient = await UserModel.findOneAndUpdate(
      { id: withUserId.trim() },
      { $push: { receives: incomingForRecipient } },
      { new: true }
    ).exec();

    if (!updatedRecipient) {
      // If the named recipient doesn’t exist, just warn. We still return the updated sharer.
      console.warn(
        `/share: Sharer was updated, but recipient "${withUserId.trim()}" not found.`
      );
    }

    // Return the updated sharer document (with its shares[] now containing the new share):
    return res.status(200).json(updatedSharer);
  } catch (err: any) {
    console.error("POST /api/users/:id/share error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/users/:id/share/:withUserId
 *   “id” is the sharer’s username (the logged‐in user’s ID)
 *   “withUserId” is the other user we want to stop sharing with
 *   removes the share from both sides:
 *      1) $pull from sharer.shares where withUserId matches
 *      2) $pull from recipient.receives where withUserId === sharer
 *   requires that (req as any).userId === req.params.id
 *   returns 200 + JSON(updatedSharer) on success
 */
router.delete(
  "/:id/share/:withUserId",
  async (req: Request, res: Response) => {
    try {
      const sharerId = req.params.id;
      const targetId = req.params.withUserId;

      // Security check: only the logged‐in user can stop sharing from their own account
      if ((req as any).userId !== sharerId) {
        return res
          .status(403)
          .send("Forbidden: cannot stop sharing on behalf of another user");
      }

      // Pull (remove) from sharer.shares
      const updatedSharer = await UserModel.findOneAndUpdate(
        { id: sharerId },
        { $pull: { shares: { withUserId: targetId } } },
        { new: true }
      ).exec();

      if (!updatedSharer) {
        return res
          .status(404)
          .send(`Sharer user "${sharerId}" not found`);
      }

      // Pull (remove) from recipient.receives
      const updatedRecipient = await UserModel.findOneAndUpdate(
        { id: targetId.trim() },
        { $pull: { receives: { withUserId: sharerId } } },
        { new: true }
      ).exec();

      if (!updatedRecipient) {
        // If recipient doesn’t exist, log a warning but still return the updatedSharer
        console.warn(
          `/share: Stopped share from "${sharerId}" to "${targetId}", but recipient "${targetId}" not found.`
        );
      }

      // 4) Return the updated sharer
      return res.status(200).json(updatedSharer);
    } catch (err: any) {
      console.error(
        "DELETE /api/users/:id/share/:withUserId error:",
        err
      );
      return res.status(500).json({ error: err.message });
    }
  }
);

export default router;
