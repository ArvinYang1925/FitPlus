// 1. 引入套件 & 設定
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { dataSource } = require("./config/data-source");

// 2. 建立 app 與設定 port
const app = express();
const port = process.env.PORT || 3000;

// 3. 引入路由
const apiRoutes = require("./routes/api");
const creditPackageRoutes = require("./routes/creditPackage");

// 4. 註冊 middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 5. 註冊路由
app.use("/api", apiRoutes);
app.use("/api/credit-package", creditPackageRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to FitPlus API!");
});

// 6. 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "找不到此路由",
  });
});

// 7. 錯誤處理 middleware
app.use((err, req, res, next) => {
  console.error("❌ 錯誤捕捉：", err);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "伺服器錯誤",
  });
});

// 8. 初始化資料庫 & 啟動伺服器
dataSource
  .initialize()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(port, () => {
      console.log(`FitPlus API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
