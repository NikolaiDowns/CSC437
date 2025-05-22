import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import credentials from "../services/credential-svc";

dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_SECRET";

const router = express.Router();

// helper to sign a JWT
function generateAccessToken(username: string): Promise<string> {
  return new Promise((res, rej) =>
    jwt.sign(
      { username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (err, token) => err ? rej(err) : res(token!)
    )
  );
}

// 4a) Register → create creds + return token
router.post("/register", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string")
    return void res.status(400).send("Invalid input");
  credentials
    .create(username, password)
    .then(() => generateAccessToken(username))
    .then(token => res.status(201).json({ token }))
    .catch(err => res.status(409).json({ error: err.message }));
});

// 4b) Login → verify + return token
router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password)
    return void res.status(400).send("Invalid input");
  credentials
    .verify(username, password)
    .then(user => generateAccessToken(user))
    .then(token => res.status(200).json({ token }))
    .catch(() => res.status(401).send("Unauthorized"));
});

// 4c) JWT‐check middleware
export function authenticateUser(
  req: Request, res: Response, next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) return void res.status(401).end();
  jwt.verify(token, TOKEN_SECRET, (err) =>
    err ? res.status(403).end() : next()
  );
}

export default router;
