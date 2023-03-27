const express = require("express");
const { UserModel } = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password, age, city, is_married } = req.body;
  bcrypt.hash(password, 8, async function (err, hash) {
    if (hash) {
      try {
        const user = new UserModel({
          name,
          email,
          gender,
          password: hash,
          age,
          city,
          is_married,
        });
        await user.save();
        res.status(200).send("User registered");
      } catch (err) {
        res.send(err);
      }
    }
  });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.find({ email });

  bcrypt.compare(password, user[0].password, function (err, result) {
    if (result) {
      const token = jwt.sign({ userID: user[0]._id }, "bruce");
      res.status(200).send({ msg: "User logged in", token: token });
    } else {
      res.status(400).send("Wrong credentials");
    }
  });
});

module.exports = { userRouter };
