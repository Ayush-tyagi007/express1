const mongoose = require("mongoose");
const express = require("express");
const { User, access_token } = require("../model");
async function auth(req, res, next) {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (user) {
      if (user.username == req.body.username) {
        res.send("username exists");
      } else if (user.email == req.body.email) {
        res.send("user with this email exist");
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (er) {
    res.send(er);
  }
}

async function expiryValidator(req, res, next) {
  try {
    const token = await access_token.findOne({ token: req.headers.access });
    if (token) {
      req.token = token;
      next();
    } else {
      res.send("token not exists");
    }
  } catch (er) {
    res.send(er);
  }
}
module.exports = { auth, expiryValidator };
//completed