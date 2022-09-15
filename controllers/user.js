const Users = require("../models/user");
const Payments = require("../models/payment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await Users.findOne({ email });
    if (user) return res.status(400).json({ msg: "The email already exists." });

    if (password.length < 6)
      return res
        .status(400)
        .json({ msg: "Password is at least 6 charactes long." });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await Users({
      name,
      email,
      password: passwordHash,
    });

    await newUser.save();

    const accesstoken = createAccessToken({ id: newUser._id });

    res.json({ accesstoken });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

    // If login success, create accesstoken and refreshtoken
    const accesstoken = createAccessToken({ id: user._id });

    res.json({ accesstoken });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
const logout = async (req, res) => {
  try {
    return res.json({ msg: "Logged out." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
const refreshToken = (req, res) => {
  try {
    const rf_token = req.body.reftoken;
    if (!rf_token)
      return res.status(400).json({ msg: "Please Login or Register." });

    jwt.verify(rf_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res.status(400).json({ msg: "Please Login or Register." });

      const accesstoken = createAccessToken({ id: user.id });
      res.json({ user, accesstoken });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
const getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    res.json(user);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
const addToCart = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    await Users.findOneAndUpdate(
      { _id: req.user.id },
      {
        cart: req.body.cart,
      }
    );
    return res.json({ msg: "Added to cart." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
const history = async (req, res) => {
  try {
    const history = await Payments.find({ user_id: req.user.id });
    res.json(history);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getUser,
  addToCart,
  history,
  createAccessToken,
};
