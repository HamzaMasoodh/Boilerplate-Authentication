const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const schema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    documentUrl:{
        type:String,
        required:true
    },
    
  },
  { timestamps: true });

schema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

schema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user?._id.toString() }, process.env.token_key);

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

schema.statics.findByCredentials = async (email, password) => {

  const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

  if (!user) {
    throw new Error("Unable to login, Please signup first!");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login, Please enter correct password");
  }

  return user;
};
schema.methods.comparePassword = async function (userPassword) {
  try {
    return await bcrypt.compare(userPassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};
schema.pre(
  "save",
  async function (next) {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", schema);

module.exports = User;
