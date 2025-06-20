// packages/server/src/routes/auth.ts

import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import credentials from "../services/credential-svc";
import Users from "../services/user-svc";

dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_SECRET";

const router = express.Router();


export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).end();
  }

  jwt.verify(token, TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).end();
    }
    // Attach the username for downstream lookups:
    (req as any).userId = (payload as any).username;
    next();
  });
}

/** helper to sign & return a JWT for a given username */
function generateAccessToken(username: string): Promise<string> {
  return new Promise((resolve, reject) =>
    jwt.sign(
      { username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (err, token) => (err ? reject(err) : resolve(token!))
    )
  );
}

// Register: create credentials + create a User record
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).send("Invalid input");
  }

  try {
    // Create credentials (username/password) in your credential store:
    await credentials.create(username, password);

    // Generate fake usage data
    const randomUsage: number[] = Array.from(
      { length: 156 },
      () => Math.floor(Math.random() * 100)
    );

    // Create a matching User record in MongoDB, including that random “usage”:
    await Users.create({
      id: username,
      name: username,
      tocAccepted: false,
      shares: [],
      receives: [],          // ensure “receives” is initialized
      usage: randomUsage,    // 156 random ints here
      isDeleted: false,
      deletedAt: undefined,
    });

    // Issue a JWT and return it:
    const token = await generateAccessToken(username);
    return res.status(201).json({ token });
  } catch (err: any) {
    return res.status(409).json({ error: err.message });
  }
});

// Login: verify credentials
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).send("Invalid input");
  }

  try {
    await credentials.verify(username, password);
    const token = await generateAccessToken(username);
    return res.status(200).json({ token });
  } catch {
    return res.status(401).send("Unauthorized");
  }
});

// Fetch current user (protected by authenticateUser)
router.get(
  "/me",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const username = (req as any).userId as string;
      const user = await Users.get(username);
      if (!user) {
        return res.status(404).send("User not found");
      }
      return res.json(user);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

export default router;
