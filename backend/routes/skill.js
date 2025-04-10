const express = require("express");
// 建立一個新的 Router 物件，該物件允許你定義一組路由，然後可以將它們掛載到主應用程式中。
const router = express.Router();

const skillController = require("../controllers/skill");

router.get("/skill", (req, res) => {
  res.json({ message: "Skill API endpoint" });
});

router.get("/", skillController.getAll);

router.post("/", skillController.post);

router.delete("/:skillId", skillController.deleteSkill);

// 將 router 物件匯出，使其他檔案能夠引入並使用這個路由模組。
module.exports = router;
