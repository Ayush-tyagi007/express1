const mongoose = require("mongoose");
const express = require("express");
const { User, access_token } = require("../model");
async function auth(req, res, next) {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (user.username == req.body.username) {
      res.send("username exists");
    } else if (user.email == req.body.email) {
      res.send("user with this email exist");
    } else {
      next();
    }
  } catch (er) {
    res.send(er);
  }
}
async function validator(req, res, next) {
  try {
    const user = await User.findOne({ _id: req.headers.access });
    if (user) {
      req.user = user;
      next();
    } else {
      res.send("no user with this access_token in database");
    }
  } catch (err) {
    res.send(err);
  }
}
async function expiryValidator(req, res, next) {
  try {
    const user = await access_token.findOne({ token: req.headers.access });
    if (user) {
      req.user = user;
      next();
    } else {
      res.send("token not exists");
    }
  } catch (er) {
    res.send(er);
  }
}
module.exports = { auth, validator, expiryValidator };
