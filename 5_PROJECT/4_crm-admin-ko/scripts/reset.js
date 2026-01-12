
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const DB_PATH = process.env.DATABASE_PATH || "./data/app.sqlite";

function rmIfExists(p) {
  try {
    fs.unlinkSync(p);
  } catch (e) {}
}

rmIfExists(DB_PATH);
console.log("Deleted DB:", DB_PATH);
console.log("Run: npm run dev (or npm run init-db) then npm run seed");
