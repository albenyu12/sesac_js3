const express = require("express");
const router = express.Router();
const { all, get } = require("../db/sqlite");

function rangeWhere(range) {
  if (range === "30d") return "WHERE o.ordered_at >= datetime('now','-30 days')";
  return "";
}

router.get("/", async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const range = req.query.range === "30d" ? "30d" : "all";
    const where = rangeWhere(range);

    const kpi = await get(
      db,
      `
      SELECT
        COUNT(*) AS order_count,
        COALESCE(SUM(o.order_total_amount),0) AS revenue,
        COALESCE(AVG(o.order_total_amount),0) AS aov,
        COALESCE(COUNT(DISTINCT o.customer_id),0) AS unique_customers
      FROM orders o
      ${where}
      `
    );

    const storeMonthly = await all(
      db,
      `
      SELECT
        s.id AS store_id,
        s.name AS store_name,
        strftime('%Y-%m', o.ordered_at) AS ym,
        COUNT(*) AS order_count,
        SUM(o.order_total_amount) AS revenue
      FROM orders o
      JOIN stores s ON s.id = o.store_id
      ${where}
      GROUP BY s.id, ym
      ORDER BY ym DESC, revenue DESC
      LIMIT 200
      `
    );

    const topStores = await all(
      db,
      `
      SELECT s.id, s.name, COUNT(*) AS order_count, SUM(o.order_total_amount) AS revenue
      FROM orders o
      JOIN stores s ON s.id = o.store_id
      ${where}
      GROUP BY s.id
      ORDER BY order_count DESC, revenue DESC
      LIMIT 10
      `
    );

    res.render("dashboard", {
      range,
      kpi,
      storeMonthly,
      topStores
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
