// packages/server/test.js

console.log("🔬  minimal test starting, cwd =", process.cwd());

try {
  const express = require("express");
  console.log("require('express') succeeded:", typeof express, express.name);
} catch (err) {
  console.error("require('express') failed:", err);
  process.exit(1);
}

console.log("minimal test complete");
