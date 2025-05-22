// src/index.ts
import path from "path";
import express from "express";
import { connect } from "./services/mongo";
import Users from "./services/user-svc";
import users from "./routes/users";
import auth, { authenticateUser } from "./routes/auth";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.static(process.env.STATIC || path.join(__dirname, "../public")));

app.use(
  "/node_modules",
  express.static(path.join(__dirname, "../node_modules"))
);

app.use(express.json());

app.use("/auth", auth);

app.use("/api/users", authenticateUser, users);

app.use(
  express.static(path.join(__dirname, "../../proto/dist"))
);

app.get("/hello", (_req, res) => res.send("Hello, World"));

app.get("/user/:id", async (req, res) => {
  const user = await Users.get(req.params.id);
  return user ? res.json(user) : res.status(404).end();
});

connect("Truewalk0")
  .then(() => {
    app.listen(port, () =>
      console.log(`Server listening at http://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.error("Mongo connection failed:", err);
  });
