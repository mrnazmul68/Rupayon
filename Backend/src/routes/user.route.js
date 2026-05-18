import express from "express";
import {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  syncUser,
  markUsersActivitySeen,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/users/sync", syncUser);
router.put("/users/activity/seen", markUsersActivitySeen);
router.get("/users", getUsers);
router.get("/users/:id", getSingleUser);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
