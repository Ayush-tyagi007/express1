const express = require("express");
const mongoose = require("mongoose");
const md5 = require("md5");
const bodyParser = require("body-parser");
const { User, access_token, address } = require("./model");
const {
  auth,
  validator,
  expiryValidator,
} = require("./middleware/authentication");
const { ObjectId } = require("bson");

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const port = 3000 || process.env.PORT;
const connectDb = () =>
  new Promise((resolve, reject) => {
    try {
      resolve(
        mongoose.connect(
          "mongodb+srv://ayush:tyagi.apj@cluster0.oix8x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
          { useNewUrlParser: true, useUnifiedTopology: true }
        )
      );
      console.log("connected to database");
    } catch (err) {
      reject(err);
    }
  });
connectDb();
app.post("/user/register", auth, async (req, res) => {
  try {
    if (req.body.password == req.body.conf_password) {
      const data = {
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: md5(req.body.password),
      };
      await User.create(data);
      res.send("usercreated");
    } else {
      res.send("password and confirm password did not matched");
    }
  } catch (er) {
    res.send(er);
  }
});
app.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const givenPassword = md5(req.body.password);
      if (user.password == givenPassword) {
        const data = {
          user_id: user._id,
          token: md5(Date.now()),
        };
        await access_token.create(data);
        res.send(user._id);
      } else {
        res.status(500).send("password not matched");
      }
    } else {
      res.send("user not exists");
    }
  } catch (er) {
    res.send(er);
  }
});

app.get("/user/get/:id", expiryValidator, async (req, res) => {
  try {
    const token = req.token;
    if (token.user_id) {
      const userAddress = await User.find({ _id: token.user_id }).populate(
        "address"
      );
      res.status(200).send(userAddress);
    } else {
      res.send("token for this user id does not exist");
    }
  } catch (er) {
    res.send(er);
  }
});
app.put("/user/delete", expiryValidator, async (req, res) => {
  try {
    const token = req.token;
    const deletedUser = await User.deleteOne({ _id: token.user_id });
    await address.deleteMany({ user_id: token.user_id });
    res.send("user deleted");
  } catch (er) {
    res.send(er);
  }
});
app.get("/user/list/:page", async (req, res) => {
  try {
    const page = req.params.page - 1;
    const limitNumber = 10;
    const skipNumber = page * 10;
    const users = await User.find({}).limit(limitNumber).skip(skipNumber);
    res.send(users);
  } catch (er) {
    res.send(er);
  }
});
app.post("/user/address", expiryValidator, async (req, res) => {
  try {
    const token = req.token;
    const data = {
      user_id: token.user_id,
      phone_no: req.body.phone_no,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pin_code: req.body.pin,
    };
    const createdAddress = await address.create(data);
    const updatedUser = await User.findOneAndUpdate(
      { _id: token.user_id },
      { $push: { address: createdAddress._id } }
    );
    res.send(createdAddress);
  } catch (err) {
    res.send(err);
  }
});
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
//completed