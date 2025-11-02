import express from "express";
import passport from "passport";

const router = express.Router();

// ✅ Login success route (frontend checks this)
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "User logged in successfully",
      user: req.user,
    });
  } else {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
});

// ✅ Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/login",
  })
);

// ✅ Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000/");
  });
});

export default router;
