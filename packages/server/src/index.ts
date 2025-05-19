// src/index.ts
import express from "express";
import { connect } from "./services/mongo";
import Travelers  from "./services/traveler-svc";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.static(process.env.STATIC || "public"));
app.get("/hello", (_req, res) => res.send("Hello, World"));
app.get("/traveler/:userid", async (req, res) => {
  const data = await Travelers.get(req.params.userid);
  return data ? res.json(data) : res.status(404).end();
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
