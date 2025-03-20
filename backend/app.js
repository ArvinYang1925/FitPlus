require("dotenv").config();
const express = require("express");
const cors = require("cors");
const AppDataSource = require("./config/data-source");

const app = express();
const port = process.env.PORT || 3000;

const apiRoutes = require("./routes/api");

// 常用中間件
app.use(express.json()); // 解析 JSON 請求
app.use(express.urlencoded({ extended: true })); // 解析表單數據
app.use(cors()); // 處理跨域請求

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to FitPlus API!");
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");

    // 啟動伺服器
    app.listen(port, () => {
      console.log(`FitPlus API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
