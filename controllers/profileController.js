const Profile = require("../models/Profile");

exports.saveProfile = async (req, res) => {
  await Profile.create({
    userId: req.user.id,
    ...req.body
  });

  res.redirect("/generate-plan");
};
