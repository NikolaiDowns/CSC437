// src/index.ts
import express from "express";
import { connect } from "./services/mongo";
import Users from "./services/user-svc";
import users from "./routes/users";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.static(process.env.STATIC || "public"));
app.use(express.json());
app.use("/api/users", users);

app.get("/hello", (_req, res) => res.send("Hello, World"));

// use your user-svc instead of traveler-svc
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
