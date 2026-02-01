const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPassword });

  res.redirect("/login");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.redirect("/login");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.redirect("/login");

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, { httpOnly: true });
  res.redirect("/profile");
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};
