const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  const userAvailable = await UserModel.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exists !");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log(hashedPassword)
  const newUser = await UserModel.create({
    username,
    email,
    password: hashedPassword,
  });
  if (newUser) {
    res.status(201).json({ _id: newUser.id, email: newUser.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  const userByEmail = await UserModel.findOne({ email });
  //compare password with hashedpassword
  if (userByEmail && (await bcrypt.compare(password, userByEmail.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: userByEmail.username,
          email: userByEmail.email,
          id: userByEmail.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3d" }
    );
    res.status(200).json({ accessToken });
  }else{
    res.status(401);
    throw new Error("Email or Password is not valid !")
  }
  res.json({ message: "login user" });
});

//@desc Current user
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
