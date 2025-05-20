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
var import_mongo = require("./services/mongo");
var import_user_svc = __toESM(require("./services/user-svc"));
var import_users = __toESM(require("./routes/users"));
const app = (0, import_express.default)();
const port = Number(process.env.PORT) || 3e3;
app.use(import_express.default.static(process.env.STATIC || "public"));
app.use(import_express.default.json());
app.use("/api/users", import_users.default);
app.get("/hello", (_req, res) => res.send("Hello, World"));
app.get("/user/:id", async (req, res) => {
  const user = await import_user_svc.default.get(req.params.id);
  return user ? res.json(user) : res.status(404).end();
});
(0, import_mongo.connect)("Truewalk0").then(() => {
  app.listen(
    port,
    () => console.log(`Server listening at http://localhost:${port}`)
  );
}).catch((err) => {
  console.error("Mongo connection failed:", err);
});
