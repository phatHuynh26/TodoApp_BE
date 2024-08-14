var express = require("express");
var router = express.Router();
const userController = require("../controllers/UserController");

/// http://localhost:2610/users/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    console.log(email, password, name);
    const result = await userController.register(email, password, name);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log("đăng ký thất bại", { message: "đăng ký thất bại" });
    res.status(500).json({ status: false, data: result });
  }
});

// method:post
// http://localhost:2610/users/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userController.login(email, password);
    if (result) {
      return res.status(200).json({ status: true, data: result });
    } else {
      return res
        .status(400)
        .json({ status: false, data: "Wrong Email or Password" });
    }
  } catch (error) {
    console.log("đăng nhập thất bại", { message: "đăng nhập thất bại" });
    res.status(500).json({ status: false, data: result });
  }
});

module.exports = router;
