const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");


router
.route("/signup")
.get( userController.renderSignup)
.post(wrapAsync(userController.Signup));

router
.route("/login")
.get( userController.renderLogin)
.post(saveRedirectUrl, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
}), wrapAsync(userController.Login));

router.get("/logout",userController.Logout);


module.exports = router;