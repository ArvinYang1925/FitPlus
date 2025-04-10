require("dotenv").config();
const { DataSource } = require("typeorm");

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST, // 資料庫主機
  port: process.env.DB_PORT, // 預設端口
  username: process.env.DB_USERNAME, // 你的 PostgreSQL 用戶名
  password: process.env.DB_PASSWORD, // 你的密碼
  database: process.env.DB_NAME, // 資料庫名稱
  synchronize: true, // 自動同步（開發用）
  logging: true, // 顯示 SQL 日誌
  entities: ["models/*.js"], // 實體檔案路徑
  migrations: ["migrations/*.js"], // 遷移檔案路徑（未來使用）
});

module.exports = { dataSource };
