const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  day: { type: Date, required: true }, // ngày
  time: { type: String, required: true },
});
const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  incompleteTask: { type: [TaskSchema], default: [] },
  completedTask: { type: [TaskSchema], default: [] },
});

module.exports = mongoose.models.user || mongoose.model("user", UserSchema);
