const express = require("express");
const router = express.Router();
const { all } = require("../db/sqlite");
const { stringify } = require("csv-stringify/sync");

router.get("/", (req, res) => {
  res.render("data", {});
});

function sendCsv(res, filename, rows) {
  const csv = stringify(rows, { header: true });
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(csv);
}

router.get("/export/:entity", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const entity = req.params.entity;

    if (entity === "customers") {
      const rows = await all(db, `SELECT * FROM customers ORDER BY id DESC`);
      return sendCsv(res, "customers.csv", rows);
    }
    if (entity === "stores") {
      const rows = await all(db, `SELECT * FROM stores ORDER BY id DESC`);
      return sendCsv(res, "stores.csv", rows);
    }
    if (entity === "products") {
      const rows = await all(db, `SELECT * FROM products ORDER BY id DESC`);
      return sendCsv(res, "products.csv", rows);
    }
    if (entity === "orders") {
      const rows = await all(
        db,
        `
        SELECT o.*, c.external_id AS customer_external_id, s.name AS store_name
        FROM orders o
        JOIN customers c ON c.id=o.customer_id
        JOIN stores s ON s.id=o.store_id
        ORDER BY o.ordered_at DESC
        `
      );
      return sendCsv(res, "orders.csv", rows);
    }
    if (entity === "order_items") {
      const rows = await all(
        db,
        `
        SELECT oi.*, o.external_id AS order_external_id, p.name AS product_name
        FROM order_items oi
        JOIN orders o ON o.id=oi.order_id
        JOIN products p ON p.id=oi.product_id
        ORDER BY oi.id DESC
        `
      );
      return sendCsv(res, "order_items.csv", rows);
    }

    return res.status(400).send("Unknown entity");
  } catch (e) {
    next(e);
  }
});

module.exports = router;
