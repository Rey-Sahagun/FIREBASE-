const { db } = require("../config/firebaseConfig");

const Task = {
  async getAllTasks(userId) {
    const snapshot = await db.collection("tasks").where("userId", "==", userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  async createTask(taskData) {
    const taskRef = await db.collection("tasks").add(taskData);
    return { id: taskRef.id, ...taskData };
  },
  async updateTask(taskId, taskData) {
    await db.collection("tasks").doc(taskId).update(taskData);
    return { id: taskId, ...taskData };
  },
  async deleteTask(taskId) {
    await db.collection("tasks").doc(taskId).delete();
  }
};

module.exports = Task;
