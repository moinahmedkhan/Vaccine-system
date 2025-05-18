import express from "express";
import { login, getFilteredUsers } from "../controllers/admin.controller";

const router = express.Router();

router.post("/login", login);
router.get("/users", getFilteredUsers);

export default router;
