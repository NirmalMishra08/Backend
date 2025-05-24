import Task from "../model/task.model.js";
export const createTask=async(req,res)=>{
    try {
        const { title, description, priority, category, dueDate } = req.body;
        const { userId, organisationId } = req.user;
    
        const task = await Task.create({
          title,
          description,
          priority,
          category,
          dueDate,
          organisationId: organisationId,
          createdBy: userId
        });
       
    
       return  res.status(201).json({ success: true, task });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
}




export const assignTask = async (req, res) => {
    try {
      const { taskId, userId } = req.body;
      const task = await Task.findById(taskId);
  
      if (!task) return res.status(404).json({ message: "Task not found" });
  
      task.assignedTo = userId;
      await task.save();
  
      res.status(200).json({ success: true, message: "Task assigned" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  export const getMyTasks = async (req, res) => {
    try {
      const tasks = await Task.find({ assignedTo: req.user.userId });
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ success: false, message: "No tasks found" });
        }
      res.status(200).json({ success: true, tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  export const getAllTasks = async (req, res) => {
    try {
      const tasks = await Task.find({ organisationId: req.user.organisationId });
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ success: false, message: "No tasks found" });
        }
        
      res.status(200).json({ success: true, tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

  export const updateMyTask = async (req, res) => {
    try {
      const task = await Task.findById(req.params.taskId);
  
      if (!task || task.assignedTo.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Not your task" });
      }
  
      const { status } = req.body;
      if (["Todo", "In Progress", "Completed"].includes(status)) {
        task.status = status;
      }
  
      await task.save();
      res.status(200).json({ success: true, task });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  