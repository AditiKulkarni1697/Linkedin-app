const express = require("express");
const postRouter = express.Router();
const jwt = require("jsonwebtoken");
const { PostModel } = require("../Models/post.model");

postRouter.post("/add", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "bruce");
  req.body.userID = decoded.userID;
  const payload = req.body;
  try {
    const post = new PostModel(payload);
    await post.save();
    res.status(200).send("posted");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

postRouter.get("/", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "bruce");
  const limit = 3;
  const page = (req.query.page - 1) * limit;
  let query = {};
  query.userID = decoded.userID;

  if (req.query.min && req.query.max) {
    query.no_of_comments = { $gte: +req.query.min, $lte: +req.query.max };
  }
  if (req.query.device1 & req.query.device2) {
    query.device1 = req.query.device1;
    query.device2 = req.query.device2;
  }
  if (req.query.device) {
    query.device = req.query.device;
  }

  try {
    const posts = await PostModel.find(query).skip(page).limit(limit);
    res.status(200).send(posts);
  } catch (err) {
    res.status(400).send(err);
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "bruce");
  const postid = req.params.id;
  const payload = req.body;
  const post = await PostModel.find({ _id: postid });

  if (post[0].userID == decoded.userID) {
    await PostModel.findByIdAndUpdate({ _id: postid }, payload);
    res.status(200).send("Post is updated");
  } else {
    res.send("Please login");
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "bruce");
  const postid = req.params.id;

  const post = await PostModel.find({ _id: postid });

  if (post[0].userID == decoded.userID) {
    await PostModel.findByIdAndDelete({ _id: postid });
    res.status(200).send("Post is deleted");
  } else {
    res.send("Please login");
  }
});

module.exports = { postRouter };
