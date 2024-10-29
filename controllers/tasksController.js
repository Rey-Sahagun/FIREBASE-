const Task = require("../models/taskModel");

exports.getAllTasks = async (req, res) => {
  const userId = req.user.id;
  const tasks = await Task.getAllTasks(userId);
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const newTask = { ...req.body, userId: req.user.id };
  const task = await Task.createTask(newTask);
  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const task = await Task.updateTask(req.params.id, req.body);
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.deleteTask(req.params.id);
  res.status(204).send();
};
