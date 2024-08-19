const userModel = require("./UserModal");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

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
const addtask = async (email, title, description, day, time) => {
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }
    const newTask = {
      title: title,
      description: description || "",
      day: day,
      time: time,
    };
    user.incompleteTask.push(newTask);

    const result = await user.save();
    return result;
  } catch (error) {
    console.log("Failed to add task: ", error.message);
    throw new Error("Failed to add task");
  }
};
const showTask = async (email) => {
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }
    // Trả về danh sách incompleteTask của người dùng
    return user.incompleteTask;
  } catch (error) {
    console.log("getTask error: ", error.message);
    throw new Error("Lấy danh sách công việc lỗi");
  }
};
const doneTask = async (email, taskId) => {
  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      throw new Error("User not found");
    }

    const taskIndex = user.incompleteTask.findIndex(
      (task) => task._id.toString() === taskId
    );

    if (taskIndex === -1) {
      throw new Error("Task not found in incomplete tasks");
    }

    const [task] = user.incompleteTask.splice(taskIndex, 1);

    user.completedTask.push(task);

    const result = await user.save();

    return result;
  } catch (error) {
    console.error("Failed to complete task:", error.message);
    throw new Error("Failed to complete task");
  }
};

const showTaskDone = async (email) => {
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }
    // Trả về danh sách incompleteTask của người dùng
    return user.completedTask;
  } catch (error) {
    console.log("getTask error: ", error.message);
    throw new Error("Lấy danh sách công việc lỗi");
  }
};
const taskdetail = async (email, taskId) => {
  try {
    // Tìm user theo email
    const user = await userModel.findOne({ email: email });

    if (!user) {
      throw new Error("User not found");
    }

    // Tìm task trong incompleteTask
    let taskIndex = user.incompleteTask.findIndex(
      (task) => task._id.toString() === taskId
    );

    let task = null;

    // Nếu tìm thấy task trong incompleteTask
    if (taskIndex !== -1) {
      task = user.incompleteTask[taskIndex];
    } else {
      // Nếu không tìm thấy, tìm trong completedTask
      taskIndex = user.completedTask.findIndex(
        (task) => task._id.toString() === taskId
      );

      if (taskIndex !== -1) {
        task = user.completedTask[taskIndex];
      }
    }

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  } catch (error) {
    console.error("Error fetching task detail:", error.message);
    throw error; // throw error để xử lý ngoài hàm nếu cần thiết
  }
};

const deleteTask = async (email, taskId) => {
  try {
    // Tìm người dùng theo email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }

    // Tìm index của task trong incompleteTask
    const incompleteTaskIndex = user.incompleteTask.findIndex(
      (task) => task._id.toString() === taskId
    );

    // Tìm index của task trong completedTask
    const completedTaskIndex = user.completedTask.findIndex(
      (task) => task._id.toString() === taskId
    );

    // Xóa task khỏi incompleteTask nếu tìm thấy
    if (incompleteTaskIndex !== -1) {
      user.incompleteTask.splice(incompleteTaskIndex, 1);
    } else if (completedTaskIndex !== -1) {
      // Xóa task khỏi completedTask nếu tìm thấy
      user.completedTask.splice(completedTaskIndex, 1);
    } else {
      throw new Error("Task not found in both incomplete and completed tasks");
    }

    // Lưu người dùng sau khi xóa task
    await user.save();

    return { success: true };
  } catch (error) {
    throw error;
  }
};
module.exports = {
  register,
  login,
  addtask,
  showTask,
  doneTask,
  showTaskDone,
  taskdetail,
  deleteTask,
};
