// packages/server/test-require-all.js

console.log("🔬  Starting require tests (cwd=", process.cwd(), ")");

try {
  console.log("• require('express')");
  require("express");
  console.log("express loaded");
} catch (e) {
  console.error("express failed:", e);
}

try {
  console.log("• require('mongoose')");
  const m = require("mongoose");
  console.log("mongoose loaded, version:", m.version);
} catch (e) {
  console.error("mongoose failed:", e);
}

try {
  console.log("• require('dotenv')");
  const d = require("dotenv");
  console.log("dotenv loaded, config fn:", typeof d.config);
} catch (e) {
  console.error("dotenv failed:", e);
}

try {
  console.log("• require('./dist/services/mongo')");
  const svc = require("./dist/services/mongo");
  console.log("./dist/services/mongo loaded:", Object.keys(svc));
} catch (e) {
  console.error("./dist/services/mongo failed:", e);
}

try {
  console.log("• require('./dist/services/traveler-svc')");
  const ts = require("./dist/services/traveler-svc");
  console.log("./dist/services/traveler-svc loaded:", ts);
} catch (e) {
  console.error("./dist/services/traveler-svc failed:", e);
}

console.log("🔬  Require tests complete");
