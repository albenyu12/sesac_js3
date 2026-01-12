const express = require("express");
const router = express.Router();
const { all, get, run } = require("../db/sqlite");

router.get("/", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const q = (req.query.q || "").trim();

    const whereSql = q ? "WHERE p.name LIKE ?" : "";
    const params = q ? [`%${q}%`] : [];

    const rows = await all(
      db,
      `
      SELECT p.*,
             (SELECT COUNT(*) FROM order_items oi WHERE oi.product_id=p.id) AS ordered_lines
      FROM products p
      ${whereSql}
      ORDER BY p.id DESC
      `,
      params
    );

    res.render("products/list", { rows, q });
  } catch (e) {
    next(e);
  }
});

router.get("/new", (req, res) => {
  res.render("products/form", { mode: "new", row: null, error: null });
});

router.post("/new", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const { name, price } = req.body;

    const p = parseInt(price, 10);
    if (!name || Number.isNaN(p) || p < 0) {
      return res.render("products/form", { mode: "new", row: req.body, error: "name and valid price are required." });
    }

    await run(db, `INSERT INTO products (name, price) VALUES (?,?)`, [name.trim(), p]);
    res.redirect("/products");
  } catch (e) {
    res.render("products/form", { mode: "new", row: req.body, error: e.message });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id, 10);

    const product = await get(db, `SELECT * FROM products WHERE id=?`, [id]);
    if (!product) return res.status(404).send("Not found");

    const stats = await get(
      db,
      `
      SELECT
        COALESCE(SUM(oi.qty),0) AS qty_sum,
        COALESCE(SUM(oi.line_amount),0) AS revenue
      FROM order_items oi
      WHERE oi.product_id=?
      `,
      [id]
    );

    res.render("products/detail", { product, stats });
  } catch (e) {
    next(e);
  }
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id, 10);
    const row = await get(db, `SELECT * FROM products WHERE id=?`, [id]);
    if (!row) return res.status(404).send("Not found");
    res.render("products/form", { mode: "edit", row, error: null });
  } catch (e) {
    next(e);
  }
});

router.post("/:id/edit", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id, 10);
    const { name, price } = req.body;

    const p = parseInt(price, 10);
    if (!name || Number.isNaN(p) || p < 0) {
      return res.render("products/form", { mode: "edit", row: { ...req.body, id }, error: "name and valid price are required." });
    }

    await run(db, `UPDATE products SET name=?, price=? WHERE id=?`, [name.trim(), p, id]);
    res.redirect(`/products/${id}`);
  } catch (e) {
    res.render("products/form", { mode: "edit", row: { ...req.body, id }, error: e.message });
  }
});

router.post("/:id/delete", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const id = parseInt(req.params.id, 10);
    await run(db, `DELETE FROM products WHERE id=?`, [id]);
    res.redirect("/products");
  } catch (e) {
    res.status(400).send(`Cannot delete product: ${e.message}`);
  }
});

module.exports = router;
