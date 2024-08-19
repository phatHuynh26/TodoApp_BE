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
// method:post
// http://localhost:2610/users/addtask
router.post("/addtask", async (req, res) => {
  const { email, title, description, day, time } = req.body;

  // Kiểm tra đầu vào
  if (!email || !title || !day || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    // Gọi hàm addTaskToIncomplete để thêm task vào incompleteTask
    const updatedUser = await userController.addtask(
      email,
      title,
      description,
      day,
      time
    );
    // Trả về phản hồi thành công
    res.status(200).json({
      message: "Task added successfully",
      user: updatedUser,
    });
  } catch (error) {
    // Xử lý lỗi
    res.status(500).json({ error: error.message });
  }
});

// method:post
// http://localhost:2610/users/showtask
router.post("/showtask", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    const tasks = await userController.showTask(email);
    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks: tasks,
    });
  } catch (error) {
    console.log("Error in /showtasks route:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// method:post
// http://localhost:2610/users/donetask
router.post("/donetask", async (req, res) => {
  const { email, taskId } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    const result = await userController.doneTask(email, taskId);
    res.status(200).json({
      message: "Task marked as done successfully",
      user: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark task as completed",
      error: error.message,
    });
  }
});

// method:post
// http://localhost:2610/users/showtaskdone
router.post("/showtaskdone", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    const tasks = await userController.showTaskDone(email);
    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks: tasks,
    });
  } catch (error) {
    console.log("Error in /showtasks route:", error.message);
    res.status(500).json({ error: error.message });
  }
});
// method :post
//http://localhost:2610/users/taskdetail
router.post("/taskdetail", async (req, res) => {
  const { email, taskId } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }
  try {
    const result = await userController.taskdetail(email, taskId);
    res.status(200).json({
      // message: "Task detail",
      user: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get task detail",
      error: error.message,
    });
  }
});

// method :post
//http://localhost:2610/users/deletetask
router.post('/deletetask', async (req, res) => {
  const { email, taskId } = req.body;

  if (!email || !taskId) {
    return res.status(400).json({ error: 'Missing email or taskId' });
  }

  try {
    const result = await userController.deleteTask(email, taskId);
    res.status(200).json({
      message: 'Task deleted successfully',
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete task',
      error: error.message,
    });
  }
});
module.exports = router;
