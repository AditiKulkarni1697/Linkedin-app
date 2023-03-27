const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./Routes/user.routes");
const { postRouter } = require("./Routes/post.routes");
const { authentication } = require("./Middleware/authentication");
require("dotenv").config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/users", userRouter);
app.use(authentication);
app.use("/posts", postRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Server is connected to DB");
  } catch (err) {
    console.log(err);
  }
  console.log(`Server is runnning at port ${process.env.PORT}`);
});
