const express = require("express");
const router = express.Router();
const { all, get } = require("../db/sqlite");

router.get("/", async (req, res, next) => {
  try {
    const db = req.app.locals.db;

    const range = req.query.range === "30d" ? "30d" : "all";
    const q = (req.query.q || "").trim();
    const storeId = req.query.store_id ? parseInt(req.query.store_id, 10) : null;
    const customerId = req.query.customer_id ? parseInt(req.query.customer_id, 10) : null;

    const where = [];
    const params = [];

    if (range === "30d") {
      where.push("o.ordered_at >= datetime('now','-30 days')");
    }
    if (q) {
      where.push("(o.external_id LIKE ? OR CAST(o.id AS TEXT) LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (storeId) {
      where.push("o.store_id = ?");
      params.push(storeId);
    }
    if (customerId) {
      where.push("o.customer_id = ?");
      params.push(customerId);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const stores = await all(db, `SELECT id, name FROM stores ORDER BY name`);
    const customers = await all(db, `SELECT id, name FROM customers ORDER BY name`);

    const rows = await all(
      db,
      `
      SELECT o.*,
             c.name AS customer_name,
             s.name AS store_name
      FROM orders o
      JOIN customers c ON c.id=o.customer_id
      JOIN stores s ON s.id=o.store_id
      ${whereSql}
      ORDER BY o.ordered_at DESC
      LIMIT 200
      `,
      params
    );

    res.render("orders/list", {
      rows,
      range,
      q,
      stores,
      customers,
      storeId,
      customerId
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id, 10);

    const order = await get(
      db,
      `
      SELECT o.*, c.name AS customer_name, c.external_id AS customer_external_id,
             s.name AS store_name
      FROM orders o
      JOIN customers c ON c.id=o.customer_id
      JOIN stores s ON s.id=o.store_id
      WHERE o.id=?
      `,
      [id]
    );
    if (!order) return res.status(404).send("Not found");

    const items = await all(
      db,
      `
      SELECT oi.*, p.name AS product_name
      FROM order_items oi
      JOIN products p ON p.id=oi.product_id
      WHERE oi.order_id=?
      ORDER BY oi.id ASC
      `,
      [id]
    );

    res.render("orders/detail", { order, items });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
