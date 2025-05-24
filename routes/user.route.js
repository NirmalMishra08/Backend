import express from "express";
import { loginUser, register } from "../controller/user.controller.js";
import { authenticatedUser, authorizeRoles } from "../middleware.js";
import { getAllUser, inviteUser, upgradeUser } from "../controller/organisation.controller.js";
import { assignTask, createTask, getAllTasks, getMyTasks, updateMyTask } from "../controller/task.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login",loginUser)


router.post("/invite",authenticatedUser,authorizeRoles("Admin"),inviteUser)

router.get("/getUser",authenticatedUser,authorizeRoles("Admin","Manager"),getAllUser)
router.patch("/upgrade/:id",authenticatedUser,authorizeRoles("Admin","Manager"),upgradeUser)


router.post("/create",authenticatedUser,authorizeRoles("Manager","Admin"),createTask);

// // Manager only can assign tasks
router.post('/assign', authenticatedUser, authorizeRoles('Manager'), assignTask);


// // Members can view and update only their tasks
router.get('/my-tasks', authenticatedUser, authorizeRoles('Member'), getMyTasks);
router.get('/alltasks', authenticatedUser, authorizeRoles('Admin','Manager'), getAllTasks);
router.put('/update/:taskId', authenticatedUser, authorizeRoles('Member'), updateMyTask);

// // Admin can delete any task
// router.delete('/:taskId', authenticatedUser, authorizeRoles('Admin'), deleteTask);






export default router;