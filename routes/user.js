const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userControllers = require("../controllers/users");

router.route("/signup")
    .get(userControllers.renderSignup)
    .post(wrapAsync(userControllers.signup));

router.route("/login")
    .get(userControllers.renderLogin)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), wrapAsync(userControllers.login));

router.get("/logout", wrapAsync(userControllers.logout));

module.exports = router;