const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function openDb(dbPath) {
  ensureDir(path.dirname(dbPath));
  const db = new sqlite3.Database(dbPath);
  db.serialize(() => db.run("PRAGMA foreign_keys = ON;"));
  return db;
}

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function execSqlFile(db, filePath) {
  const sql = fs.readFileSync(filePath, "utf-8");
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = { openDb, run, get, all, execSqlFile };
