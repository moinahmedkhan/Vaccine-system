import express from "express";
import { getSlots, book, updateSlotController } from "../controllers/slot.controller";

const router = express.Router();

router.get("/available", getSlots);
router.post("/book", book);
router.put("/update", updateSlotController);

export default router;
