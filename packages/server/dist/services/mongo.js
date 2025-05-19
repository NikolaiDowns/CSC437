"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var mongo_exports = {};
__export(mongo_exports, {
  connect: () => connect
});
module.exports = __toCommonJS(mongo_exports);
function connect(dbname) {
  console.log("\u2699\uFE0F [mongo] initializing connection\u2026");
  const mongoose = require("mongoose");
  const dotenv = require("dotenv");
  dotenv.config();
  mongoose.set("debug", true);
  const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER } = process.env;
  let uri = `mongodb://localhost:27017/${dbname}`;
  if (MONGO_USER && MONGO_PWD && MONGO_CLUSTER) {
    uri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${dbname}?retryWrites=true&w=majority`;
    console.log("Connecting to Atlas at:", uri);
  } else {
    console.log("Connecting to local Mongo at:", uri);
  }
  return mongoose.connect(uri).then((m) => {
    console.log("MongoDB connected");
    return m;
  }).catch((err) => {
    console.error("MongoDB connection error:", err);
    throw err;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  connect
});
