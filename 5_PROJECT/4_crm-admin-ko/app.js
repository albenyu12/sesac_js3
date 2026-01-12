require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");

const { openDb, execSqlFile } = require("./db/sqlite");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const customersRoutes = require("./routes/customers");
const storesRoutes = require("./routes/stores");
const productsRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");
const dataRoutes = require("./routes/data");
const apiRoutes = require("./routes/api");

const app = express();

const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DATABASE_PATH || "./data/app.sqlite";

const db = openDb(DB_PATH);
app.locals.db = db;

async function initDb() {
  const schemaPath = path.join(__dirname, "db", "schema.sql");
  await execSqlFile(db, schemaPath);
  console.log("DB initialized:", DB_PATH);
}

if (process.argv.includes("--init-db")) {
  initDb().then(() => process.exit(0)).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true }
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.query = req.query || {};
  next();
});

function requireAuth(req, res, next) {
  if (req.session.user) return next();
  return res.redirect("/login");
}

app.use("/", authRoutes);
app.use("/dashboard", requireAuth, dashboardRoutes);
app.use("/customers", requireAuth, customersRoutes);
app.use("/stores", requireAuth, storesRoutes);
app.use("/products", requireAuth, productsRoutes);
app.use("/orders", requireAuth, ordersRoutes);
app.use("/data", requireAuth, dataRoutes);

// API (external ingestion)
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  return res.redirect("/dashboard");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("Failed to init db", e);
    process.exit(1);
  });
