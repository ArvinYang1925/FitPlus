const { dataSource } = require("../config/data-source");
// const { body, validationResult } = require("express-validator");
const { isUndefined, isNotValidString, isNotValidInteger, isNotValidUUID } = require("../utils/validUtils");
const appError = require("../utils/appError");

async function getAll(req, res, next) {
  try {
    const skills = await dataSource.getRepository("Skill").find();

    res.status(200).json({
      status: "success",
      data: skills,
    });
  } catch (error) {
    next(error);
  }
}

async function post(req, res, next) {
  try {
    const { name } = req.body;
    if (isUndefined(name) || isNotValidString(name)) {
      next(appError(400, "欄位未填寫正確"));
      return;
    }
    const skillRepo = dataSource.getRepository("Skill");

    const existSkill = await skillRepo.findOne({
      where: {
        name,
      },
    });

    if (existSkill) {
      next(appError(409, "資料重複"));
      return;
    }

    const result = await skillRepo.save({ name });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

const deleteSkill = async (req, res, next) => {
  try {
    const skillId = req.params.skillId;

    if (isUndefined(skillId) || isNotValidString(skillId) || isNotValidUUID(skillId)) {
      next(appError(400, "ID錯誤"));
      return;
    }

    const result = await dataSource.getRepository("Skill").delete(skillId);
    if (result.affected === 0) {
      next(appError(400, "ID錯誤"));
      return;
    }

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = {
  getAll,
  post,
  deleteSkill,
};
