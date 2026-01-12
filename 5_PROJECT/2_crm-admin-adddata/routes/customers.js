const express = require("express");
const router = express.Router();
const { all, get, run } = require("../db/sqlite");

function parsePage(q) {
  const page = Math.max(parseInt(q.page || "1", 10), 1);
  const pageSize = Math.min(Math.max(parseInt(q.pageSize || "20", 10), 5), 100);
  const offset = (page - 1) * pageSize;
  return { page, pageSize, offset };
}

function rangeClause(range) {
  if (range === "30d") return "AND o.ordered_at >= datetime('now','-30 days')";
  return "";
}

router.get("/", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const { page, pageSize, offset } = parsePage(req.query);
    const q = (req.query.q || "").trim();
    const gender = req.query.gender === "M" || req.query.gender === "F" ? req.query.gender : "";

    const where = [];
    const params = [];
    if (q) {
      where.push("(c.external_id LIKE ? OR c.name LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (gender) {
      where.push("c.gender = ?");
      params.push(gender);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const rows = await all(
      db,
      `
      SELECT c.*,
             (SELECT COUNT(*) FROM orders o WHERE o.customer_id=c.id) AS order_count
      FROM customers c
      ${whereSql}
      ORDER BY c.id DESC
      LIMIT ? OFFSET ?
      `,
      [...params, pageSize, offset]
    );

    const totalRow = await get(
      db,
      `SELECT COUNT(*) AS cnt FROM customers c ${whereSql}`,
      params
    );

    res.render("customers/list", {
      rows,
      q,
      gender,
      page,
      pageSize,
      total: totalRow.cnt
    });
  } catch (e) {
    next(e);
  }
});

router.get("/new", (req, res) => {
  res.render("customers/form", { mode: "new", row: null, error: null });
});

router.post("/new", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const { external_id, name, gender, birthdate } = req.body;

    if (!external_id || !name) {
      return res.render("customers/form", { mode: "new", row: req.body, error: "external_id and name are required." });
    }

    await run(
      db,
      `INSERT INTO customers (external_id, name, gender, birthdate) VALUES (?,?,?,?)`,
      [external_id.trim(), name.trim(), gender || null, birthdate || null]
    );

    res.redirect("/customers");
  } catch (e) {
    res.render("customers/form", { mode: "new", row: req.body, error: e.message });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id, 10);

    const customer = await get(db, `SELECT * FROM customers WHERE id=?`, [id]);
    if (!customer) return res.status(404).send("Not found");

    const orders = await all(
      db,
      `
      SELECT o.*, s.name AS store_name
      FROM orders o
      JOIN stores s ON s.id=o.store_id
      WHERE o.customer_id=?
      ORDER BY o.ordered_at DESC
      LIMIT 50
      `,
      [id]
    );

    const range = req.query.range === "30d" ? "30d" : "all";
    const rangeAnd = rangeClause(range);

    const summary = await get(
      db,
      `
      SELECT
        COUNT(*) AS order_count,
        COALESCE(SUM(o.order_total_amount),0) AS revenue,
        COALESCE(AVG(o.order_total_amount),0) AS aov,
        COALESCE(MAX(o.ordered_at),'') AS last_ordered_at
      FROM orders o
      WHERE o.customer_id=?
      ${rangeAnd}
      `,
      [id]
    );

    const topStores = await all(
      db,
      `
      SELECT s.id, s.name,
             COUNT(*) AS order_count,
             COALESCE(MAX(o.ordered_at),'') AS last_ordered_at
      FROM orders o
      JOIN stores s ON s.id=o.store_id
      WHERE o.customer_id=?
      ${rangeAnd}
      GROUP BY s.id
      ORDER BY order_count DESC, last_ordered_at DESC
      LIMIT 5
      `,
      [id]
    );

    const topProducts = await all(
      db,
      `
      SELECT p.id, p.name,
             SUM(oi.qty) AS qty_sum,
             COALESCE(MAX(o.ordered_at),'') AS last_ordered_at
      FROM orders o
      JOIN order_items oi ON oi.order_id=o.id
      JOIN products p ON p.id=oi.product_id
      WHERE o.customer_id=?
      ${rangeAnd}
      GROUP BY p.id
      ORDER BY qty_sum DESC, last_ordered_at DESC
      LIMIT 5
      `,
      [id]
    );

    res.render("customers/detail", {
      customer,
      orders,
      range,
      summary,
      topStores,
      topProducts
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id, 10);
    const row = await get(db, `SELECT * FROM customers WHERE id=?`, [id]);
    if (!row) return res.status(404).send("Not found");
    res.render("customers/form", { mode: "edit", row, error: null });
  } catch (e) {
    next(e);
  }
});

router.post("/:id/edit", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id, 10);
    const { external_id, name, gender, birthdate } = req.body;

    if (!external_id || !name) {
      return res.render("customers/form", { mode: "edit", row: { ...req.body, id }, error: "external_id and name are required." });
    }

    await run(
      db,
      `UPDATE customers SET external_id=?, name=?, gender=?, birthdate=? WHERE id=?`,
      [external_id.trim(), name.trim(), gender || null, birthdate || null, id]
    );
    res.redirect(`/customers/${id}`);
  } catch (e) {
    res.render("customers/form", { mode: "edit", row: { ...req.body, id }, error: e.message });
  }
});

router.post("/:id/delete", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id, 10);
    await run(db, `DELETE FROM customers WHERE id=?`, [id]);
    res.redirect("/customers");
  } catch (e) {
    res.status(400).send(`Cannot delete customer: ${e.message}`);
  }
});

module.exports = router;
