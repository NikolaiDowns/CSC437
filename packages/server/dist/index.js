"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_path = __toESM(require("path"));
var import_mongo = require("./services/mongo");
var import_users = __toESM(require("./routes/users"));
var import_auth = __toESM(require("./routes/auth"));
const app = (0, import_express.default)();
const port = Number(process.env.PORT) || 3e3;
app.use(
  import_express.default.static(process.env.STATIC || import_path.default.join(__dirname, "../public"))
);
app.use(
  "/node_modules",
  import_express.default.static(import_path.default.join(__dirname, "../node_modules"))
);
app.use(
  (0, import_cors.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);
app.use(import_express.default.json());
app.use("/api/auth", import_auth.default);
app.use("/api/users", import_auth.authenticateUser, import_users.default);
app.use(import_express.default.static(import_path.default.join(__dirname, "../../proto/dist")));
app.get("/hello", (_req, res) => res.send("Hello, World"));
app.get("/user/:id", async (req, res) => {
  const { default: Users } = await import("./services/user-svc");
  const user = await Users.get(req.params.id);
  return user ? res.json(user) : res.status(404).end();
});
(0, import_mongo.connect)("Truewalk0").then(() => {
  console.log("\u{1F7E2} MongoDB connected");
  console.log("\u{1F7E2} Starting server\u2026");
  const host = process.env.HOST || "0.0.0.0";
  app.listen(port, host, () => {
    console.log(`\u{1F7E2} Server listening on http://${host}:${port}`);
  });
}).catch((err) => {
  console.error("\u26A0\uFE0F MongoDB connection failed:", err);
  process.exit(1);
});
