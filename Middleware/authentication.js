const express = require("express");
const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, "bruce", (err, decoded) => {
      if (decoded) {
        next();
      } else {
        res.send("wrong credentials");
      }
    });
  } else {
    res.send("Please login");
  }
};

module.exports = { authentication };
