// packages/server/src/index.ts

import express from "express";
import cors from "cors";
import path from "path";
import { connect } from "./services/mongo";
import usersRouter from "./routes/users";
import authRouter, { authenticateUser } from "./routes/auth";

const app = express();
const port = Number(process.env.PORT) || 3000;

//Serve static assets
app.use(
  express.static(process.env.STATIC || path.join(__dirname, "../public"))
);
app.use(
  "/node_modules",
  express.static(path.join(__dirname, "../node_modules"))
);

// Enable CORS and explicitly allow the Authorization header
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

//JSON parser middleware
app.use(express.json());

// Mount Auth routes at /api/auth

app.use("/api/auth", authRouter);

// Mount protected User routes at /api/users
app.use("/api/users", authenticateUser, usersRouter);

// for debugging
app.get("/hello", (_req, res) => res.send("Hello, World"));

// Connect to MongoDB and start server

connect("Truewalk0")
  .then(() => {
    console.log("MongoDB connected");
    console.log("Starting server…");
    const host = process.env.HOST || "0.0.0.0";
    app.listen(port, host, () => {
      console.log(`Server listening on http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error("⚠️ MongoDB connection failed:", err);
    process.exit(1);
  });
