
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { openDb, execSqlFile, run, get, all } = require("../db/sqlite");

const DB_PATH = process.env.DATABASE_PATH || "./data/app.sqlite";

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function isoDate(d) {
  // SQLite accepts "YYYY-MM-DD HH:MM:SS" or ISO; keep it simple.
  return d.toISOString();
}

async function initSchema(db) {
  const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
  await execSqlFile(db, schemaPath);
}

async function seed() {
  const db = openDb(DB_PATH);
  await initSchema(db);

  // Basic catalog
  const storeNames = ["Gangnam Store", "Hongdae Store", "Jamsil Store", "Seongsu Store", "Yeouido Store"];
  const products = [
    { name: "Americano", price: 4500 },
    { name: "Latte", price: 5500 },
    { name: "Vanilla Latte", price: 6000 },
    { name: "Cold Brew", price: 5800 },
    { name: "Tea", price: 5000 },
    { name: "Sandwich", price: 7500 },
    { name: "Salad", price: 8900 },
    { name: "Cookie", price: 2500 },
    { name: "Cake Slice", price: 6500 },
    { name: "Bottle Water", price: 1200 }
  ];

  // Customers: external_id U-0001...
  const firstNames = ["Min", "Jisoo", "Hyun", "Sora", "Joon", "Yuna", "Doyoung", "Hana", "Sejin", "Ara"];
  const lastNames = ["Kim", "Lee", "Park", "Choi", "Jung", "Kang", "Cho", "Yoon", "Jang", "Lim"];

  // Insert stores if empty
  const existingStores = await all(db, "SELECT id FROM stores LIMIT 1");
  if (existingStores.length === 0) {
    for (const n of storeNames) {
      await run(db, "INSERT INTO stores (name) VALUES (?)", [n]);
    }
  }

  // Insert products if empty
  const existingProducts = await all(db, "SELECT id FROM products LIMIT 1");
  if (existingProducts.length === 0) {
    for (const p of products) {
      await run(db, "INSERT INTO products (name, price) VALUES (?,?)", [p.name, p.price]);
    }
  }

  // Insert customers if empty
  const existingCustomers = await all(db, "SELECT id FROM customers LIMIT 1");
  if (existingCustomers.length === 0) {
    for (let i = 1; i <= 60; i++) {
      const external_id = `U-${String(i).padStart(4, "0")}`;
      const name = `${pick(lastNames)} ${pick(firstNames)}`;
      const gender = Math.random() < 0.5 ? "M" : "F";
      // birthdate between 1975-01-01 and 2006-12-31
      const year = randInt(1975, 2006);
      const month = randInt(1, 12);
      const day = randInt(1, 28);
      const birthdate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      await run(
        db,
        "INSERT INTO customers (external_id, name, gender, birthdate) VALUES (?,?,?,?)",
        [external_id, name, gender, birthdate]
      );
    }
  }

  // Generate orders if none exist
  const existingOrders = await all(db, "SELECT id FROM orders LIMIT 1");
  if (existingOrders.length > 0) {
    console.log("Orders already exist. Skipping order seeding.");
    process.exit(0);
  }

  const storeRows = await all(db, "SELECT id, name FROM stores");
  const productRows = await all(db, "SELECT id, name, price FROM products");
  const customerRows = await all(db, "SELECT id, external_id FROM customers");

  // Create orders over last 180 days
  const now = new Date();
  const start = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  // Bias: some customers and stores become "regulars"
  const heavyCustomers = customerRows.slice(0, 10).map(c => c.id);
  const heavyStores = storeRows.slice(0, 2).map(s => s.id); // top 2 stores busier

  const orderCount = 650; // adjust as you like
  for (let i = 1; i <= orderCount; i++) {
    const isHeavyCustomer = Math.random() < 0.35;
    const customer_id = isHeavyCustomer ? pick(heavyCustomers) : pick(customerRows).id;

    const isHeavyStore = Math.random() < 0.45;
    const store_id = isHeavyStore ? pick(heavyStores) : pick(storeRows).id;

    const t = randInt(0, 180 * 24 * 60 * 60);
    const ordered_at = new Date(start.getTime() + t * 1000);

    // items
    const itemLines = randInt(1, 4);
    let total = 0;
    const items = [];
    for (let l = 0; l < itemLines; l++) {
      const pr = pick(productRows);
      const qty = randInt(1, 3);
      const unit_price = pr.price;
      const line_amount = unit_price * qty;
      total += line_amount;
      items.push({ product_id: pr.id, qty, unit_price, line_amount });
    }

    const external_id = `ORD-${String(i).padStart(6, "0")}`;

    const ins = await run(
      db,
      "INSERT INTO orders (external_id, customer_id, store_id, ordered_at, order_total_amount) VALUES (?,?,?,?,?)",
      [external_id, customer_id, store_id, isoDate(ordered_at), total]
    );
    const order_id = ins.lastID;

    for (const it of items) {
      await run(
        db,
        "INSERT INTO order_items (order_id, product_id, qty, unit_price, line_amount) VALUES (?,?,?,?,?)",
        [order_id, it.product_id, it.qty, it.unit_price, it.line_amount]
      );
    }
  }

  console.log(`Seed complete: stores=${storeRows.length}, products=${productRows.length}, customers=${customerRows.length}, orders=${orderCount}`);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
