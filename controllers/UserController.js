const userModel = require("./UserModal");
const bcrypt = require("bcryptjs");

const register = async (email, password, name) => {
  try {
    var user = await userModel.findOne({ email: email });
    if (user) {
      throw new Error("Email already exists");
    }
    // max hoa password
    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);
    user = new userModel({
      email: email,
      password: password,
      name: name,
    });
    const result = await user.save();
    return result;
  } catch (error) {
    console.log("Register user failed", error.message);
  }
};

const login = async (email, password) => {
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email does not exist");
    } else {
      const check = bcrypt.compareSync(password, user.password);
      if (check) {
        return user;
      }
    }
    return null;
  } catch (error) {
    console.log("Login failed: ", error.message);
    throw new Error("Login failed");
  }
};

module.exports = { register, login };
