// cron/taskExpiry.js
import cron from "node-cron";
import Task from "../model/task.model.js";


export const startTaskExpiryJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();
    const tasks = await Task.updateMany(
      { dueDate: { $lt: now }, status: { $nin: ["Completed", "Expired"] } },
      { $set: { status: "Expired" } }
    );
    console.log(`Task expiry job ran: ${tasks.modifiedCount} expired.`);
  });
};
