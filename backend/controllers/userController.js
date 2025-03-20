const AppDataSource = require("../config/data-source");
const User = require("../models/User");

const getUsers = async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const users = await userRepo.find();
  res.json(users);
};

const createUser = async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const newUser = userRepo.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password, // 生產環境應加密
  });
  const result = await userRepo.save(newUser);
  res.json(result);
};

module.exports = { getUsers, createUser };
