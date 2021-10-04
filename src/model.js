const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  address: [{ type: mongoose.Schema.Types.ObjectId, ref: "address" }],
});
const access_tokenSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  token: String,
  expiry: { type: Date, expires: 3600 },
});
const addressSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pin_code: {
    type: Number,
    required: true,
  },
  phone_no: {
    type: Number,
    required: true,
  },
});
const User = mongoose.model("User", UserSchema);
const access_token = mongoose.model("access_token", access_tokenSchema);
const address = mongoose.model("address", addressSchema);
module.exports = { User, access_token, address };
