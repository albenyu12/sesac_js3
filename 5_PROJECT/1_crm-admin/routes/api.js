const express = require("express");
const router = express.Router();
const { get, run } = require("../db/sqlite");

function requireApiKey(req, res, next) {
  const apiKey = process.env.API_KEY || "";
  if (!apiKey) return res.status(500).json({ error: "API_KEY not configured" });
  const key = req.headers["x-api-key"];
  if (key !== apiKey) return res.status(401).json({ error: "Unauthorized" });
  next();
}

router.post("/orders/upsert", requireApiKey, async (req, res, next) => {
  try {
    const db = req.app.locals.db;

    const { external_id, ordered_at, customer_external_id, store_id, items } = req.body;

    if (!ordered_at || !customer_external_id || !store_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Customer auto-create (name unknown -> external_id)
    let customer = await get(db, `SELECT * FROM customers WHERE external_id=?`, [customer_external_id]);
    if (!customer) {
      const ins = await run(
        db,
        `INSERT INTO customers (external_id, name) VALUES (?,?)`,
        [customer_external_id, customer_external_id]
      );
      customer = await get(db, `SELECT * FROM customers WHERE id=?`, [ins.lastID]);
    }

    // Validate store
    const storeId = parseInt(store_id, 10);
    const store = await get(db, `SELECT * FROM stores WHERE id=?`, [storeId]);
    if (!store) return res.status(400).json({ error: "Invalid store_id" });

    // Validate products, compute totals using current product price
    let total = 0;
    const enriched = [];

    for (const it of items) {
      const pid = parseInt(it.product_id, 10);
      const qty = parseInt(it.qty, 10);
      if (!pid || !qty || qty <= 0) return res.status(400).json({ error: "Invalid item" });

      const p = await get(db, `SELECT * FROM products WHERE id=?`, [pid]);
      if (!p) return res.status(400).json({ error: `Unknown product_id: ${pid}` });

      const unit_price = p.price;
      const line_amount = unit_price * qty;
      total += line_amount;
      enriched.push({ product_id: pid, qty, unit_price, line_amount });
    }

    // Upsert order
    let orderId = null;

    if (external_id) {
      const existing = await get(db, `SELECT * FROM orders WHERE external_id=?`, [external_id]);
      if (existing) {
        orderId = existing.id;
        await run(
          db,
          `UPDATE orders SET customer_id=?, store_id=?, ordered_at=?, order_total_amount=? WHERE id=?`,
          [customer.id, storeId, ordered_at, total, orderId]
        );
        await run(db, `DELETE FROM order_items WHERE order_id=?`, [orderId]);
      } else {
        const ins = await run(
          db,
          `INSERT INTO orders (external_id, customer_id, store_id, ordered_at, order_total_amount)
           VALUES (?,?,?,?,?)`,
          [external_id, customer.id, storeId, ordered_at, total]
        );
        orderId = ins.lastID;
      }
    } else {
      const ins = await run(
        db,
        `INSERT INTO orders (customer_id, store_id, ordered_at, order_total_amount)
         VALUES (?,?,?,?)`,
        [customer.id, storeId, ordered_at, total]
      );
      orderId = ins.lastID;
    }

    for (const it of enriched) {
      await run(
        db,
        `INSERT INTO order_items (order_id, product_id, qty, unit_price, line_amount)
         VALUES (?,?,?,?,?)`,
        [orderId, it.product_id, it.qty, it.unit_price, it.line_amount]
      );
    }

    return res.json({ ok: true, order_id: orderId, total });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
