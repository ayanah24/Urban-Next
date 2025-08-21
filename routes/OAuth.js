const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/signup', failureFlash: true }),
  (req, res) => {
    req.flash('success', 'Logged in with Google!');
    res.redirect('/listings');
  });



module.exports = router;
