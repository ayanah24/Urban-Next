const User = require('../models/user.js');

module.exports.renderSignup= (req, res) => {
 res.render("users/signup.ejs",{hideSearch:true});
}

module.exports.Signup=async (req, res) => {
try{
let{username, email, password} = req.body;
const newUser= new User({username, email});
const registeredUser = await User.register(newUser, password);
console.log(registeredUser);
req.login(registeredUser, (err) => {
    if(err){
        return next(err);
    }
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
});
} catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
}
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs" ,{hideSearch:true});
}

module.exports.Login=async (req,res)=>{
   req.flash("success", "Welcome back!");
   let redirectUrl=res.locals.redirectUrl || "/listings"; // Use the saved redirect URL or default to "/listings"
   res.redirect(redirectUrl);
}

module.exports.Logout= (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err); 
      return next(err); 
    }
    req.flash("success", "You have successfully logged out!");
    res.redirect("/listings");
  });
}