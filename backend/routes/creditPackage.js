const express = require("express");

// 建立一個新的 Router 物件，該物件允許你定義一組路由，然後可以將它們掛載到主應用程式中。
const router = express.Router();

const creditPackageController = require("../controllers/creditPackage");

// 取得購買方案列表
router.get("/", creditPackageController.getAll);

// 新增購買方案
router.post("/", creditPackageController.validateCreditPackage, creditPackageController.post);

// 刪除購買方案
router.delete("/:creditPackageId", creditPackageController.deletePackage);

// 將 router 物件匯出，使其他檔案能夠引入並使用這個路由模組。
module.exports = router;
