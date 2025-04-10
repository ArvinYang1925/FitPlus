const { dataSource } = require("../config/data-source");
const { body, validationResult } = require("express-validator");
const { isUndefined, isNotValidString, isNotValidInteger, isNotValidUUID } = require("../utils/validUtils");
const appError = require("../utils/appError");

// 取得購買方案列表
async function getAll(req, res, next) {
  try {
    const packages = await dataSource.getRepository("CreditPackage").find();

    res.status(200).json({
      status: "success",
      data: packages,
    });
  } catch (error) {
    next(error);
  }
}

// 定義驗證規則
const validateCreditPackage = [
  body("name").notEmpty().withMessage("名稱不能為空").isString().withMessage("名稱必須為字串"),
  body("credit_amount").notEmpty().withMessage("點數不能為空").isInt().withMessage("點數必須為整數"),
  body("price").notEmpty().withMessage("價格不能為空").isInt().withMessage("價格必須為整數"),
];

async function post(req, res, next) {
  try {
    // 檢查驗證結果
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確",
        errors: errors.array(),
      });
    }

    // 解構
    const { name, credit_amount, price } = req.body;

    // 禁止資料重複 先操作資料庫
    const creditPackageRepo = await dataSource.getRepository("CreditPackage");
    const existPackage = await creditPackageRepo.find({
      where: {
        name,
      },
    });
    if (existPackage.length > 0) {
      res.status(409).json({
        status: "failed",
        message: "資料重複",
      });
      return;
    }

    // 如果只是新增並寫入資料庫，其實直接用 save() 就可以
    const result = await creditPackageRepo.save({
      name,
      credit_amount,
      price,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Post Credit Package Error:", error);
    next(error);
  }
}

async function deletePackage(req, res, next) {
  try {
    const creditPackageId = req.params.creditPackageId;
    if (isUndefined(creditPackageId) || isNotValidString(creditPackageId) || isNotValidUUID(creditPackageId)) {
      res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確",
      });
      return;
    }

    const result = await dataSource.getRepository("CreditPackage").delete(creditPackageId);

    if (result.affected === 0) {
      next(appError(400, "ID錯誤"));
      return;
    }

    res.status(200).json({
      status: "success",
      data: creditPackageId,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  post,
  deletePackage,
  validateCreditPackage,
};
