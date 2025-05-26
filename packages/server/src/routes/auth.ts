// packages/server/src/routes/auth.ts

import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import credentials from "../services/credential-svc";
import Users from "../services/user-svc";

dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_SECRET";

const router = express.Router();

/** helper to sign a JWT for a given username */
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

// 1) Register → create creds + user record + return token
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).send("Invalid input");
  }

  try {
    await credentials.create(username, password);

    // include tocAccepted so TS is happy
    await Users.create({
      id: username,
      name: username,
      tocAccepted: false
    });

    const token = await generateAccessToken(username);
    return res.status(201).json({ token });

  } catch (err: any) {
    return res.status(409).json({ error: err.message });
  }
});


// 2) Login → verify creds + return token
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

// 3) Fetch current user → requires a valid JWT
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

// 4) JWT‐check middleware
export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).end();
  }

  jwt.verify(token, TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).end();
    }
    // attach the username from the token payload
    (req as any).userId = (payload as any).username;
    next();
  });
}

export default router;
