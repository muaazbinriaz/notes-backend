let express = require("express");
let authRouter = express.Router();
const {
  signupValidation,
  loginValidation,
} = require("../middlewares/authValidation");
const { signup, login } = require("../controllers/authController");

authRouter.post("/login", loginValidation, login);
authRouter.post("/signup", signupValidation, signup);

module.exports = authRouter;
