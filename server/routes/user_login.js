const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Home");
});
// login routes
const login = require("../controllers/login");
router.post("/login", login);

const signup = require("../controllers/post_user");
router.post("/user", signup);

// user routes
const user_route = require("../controllers/user_group");
router.get("/userlist", user_route.userlist);
router.get("/user/:id", user_route.getUser);
router.put("/updaterole", user_route.updateUser_role);
router.put("/updateuser", user_route.updateUser);
router.delete("/deleteuser", user_route.deleteUser);

// Get all roles
router.get("/roles", user_route.roles_list);

// change profile dtails
// password
const change_password = require("../controllers/change_password");
router.put("/changepassword", change_password);
// update info
const edit_profile = require("../controllers/profile");
router.put("/editprofile", edit_profile);

// profile picture
const profile_picture = require("../controllers/profile_picture");
router.post(
  "/profilepicture/:id",
  profile_picture.upload.any("photo"),
  profile_picture.upload_picture
);
router.get("/profile/:filename/:id", profile_picture.get_picture);

module.exports = router;
