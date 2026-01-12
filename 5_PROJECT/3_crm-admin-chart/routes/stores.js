const express = require("express");
const router = express.Router();
const { all, get, run } = require("../db/sqlite");

function rangeAnd(range) {
  if (range === "30d") return "AND o.ordered_at >= datetime('now','-30 days')";
  return "";
}

router.get("/", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const q = (req.query.q || "").trim();
    const params = [];
    const whereSql = q ? "WHERE s.name LIKE ?" : "";
    if (q) params.push(`%${q}%`);

    const rows = await all(
      db,
      `
      SELECT s.*,
             (SELECT COUNT(*) FROM orders o WHERE o.store_id=s.id) AS order_count
      FROM stores s
      ${whereSql}
      ORDER BY s.id DESC
      `,
      params
    );

    res.render("stores/list", { rows, q });
  } catch (e) {
    next(e);
  }
});

router.get("/new", (req, res) => {
  res.render("stores/form", { mode: "new", row: null, error: null });
});

router.post("/new", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const { name } = req.body;
    if (!name) return res.render("stores/form", { mode: "new", row: req.body, error: "name is required." });
    await run(db, `INSERT INTO stores (name) VALUES (?)`, [name.trim()]);
    res.redirect("/stores");
  } catch (e) {
    res.render("stores/form", { mode: "new", row: req.body, error: e.message });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id, 10);

    const store = await get(db, `SELECT * FROM stores WHERE id=?`, [id]);
    if (!store) return res.status(404).send("Not found");

    const orders = await all(
      db,
      `
      SELECT o.*, c.name AS customer_name
      FROM orders o
      JOIN customers c ON c.id=o.customer_id
      WHERE o.store_id=?
      ORDER BY o.ordered_at DESC
      LIMIT 50
      `,
      [id]
    );

    const range = req.query.range === "30d" ? "30d" : "all";
    const andSql = rangeAnd(range);

    const monthly = await all(
      db,
      `
      SELECT
        strftime('%Y-%m', o.ordered_at) AS ym,
        COUNT(*) AS order_count,
        SUM(o.order_total_amount) AS revenue,
        COUNT(DISTINCT o.customer_id) AS unique_customers
      FROM orders o
      WHERE o.store_id=?
      ${andSql}
      GROUP BY ym
      ORDER BY ym DESC
      LIMIT 12
      `,
      [id]
    );

    const loyal = await all(
      db,
      `
      SELECT
        c.id, c.name, c.external_id,
        COUNT(*) AS order_count,
        COALESCE(MAX(o.ordered_at),'') AS last_ordered_at
      FROM orders o
      JOIN customers c ON c.id=o.customer_id
      WHERE o.store_id=?
      ${andSql}
      GROUP BY c.id
      ORDER BY order_count DESC, last_ordered_at DESC
      LIMIT 10
      `,
      [id]
    );

    res.render("stores/detail", { store, orders, range, monthly, loyal });
  } catch (e) {
    next(e);
  }
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id, 10);
    const row = await get(db, `SELECT * FROM stores WHERE id=?`, [id]);
    if (!row) return res.status(404).send("Not found");
    res.render("stores/form", { mode: "edit", row, error: null });
  } catch (e) {
    next(e);
  }
});

router.post("/:id/edit", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
    if (!name) return res.render("stores/form", { mode: "edit", row: { ...req.body, id }, error: "name is required." });
    await run(db, `UPDATE stores SET name=? WHERE id=?`, [name.trim(), id]);
    res.redirect(`/stores/${id}`);
  } catch (e) {
    res.render("stores/form", { mode: "edit", row: { ...req.body, id }, error: e.message });
  }
});

router.post("/:id/delete", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id, 10);
    await run(db, `DELETE FROM stores WHERE id=?`, [id]);
    res.redirect("/stores");
  } catch (e) {
    res.status(400).send(`Cannot delete store: ${e.message}`);
  }
});

module.exports = router;
