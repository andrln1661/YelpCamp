import User from "../models/user.js";

// SignIn
export const signinForm = (req, res) => {
  res.render("user/signin");
};

export const signin = (req, res) => {
  const redirectUrl = req.session.returnTo || "/camps";
  delete req.session.returnTo;
  req.flash("success", "Welcome back");
  res.redirect(redirectUrl);
};

// SignUp
export const signupForm = (req, res) => {
  res.render("user/signup");
};

export const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registredUser = await User.register(user, password);
    req.login(registredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome back");
      res.redirect("/camps");
    });
    req.flash("success", "Signed Up");
    res.redirect("/camps");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("signup");
  }
};

// SignOut
export const signout = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/camps");
};
