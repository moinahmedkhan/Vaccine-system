import { Request, Response } from "express";
import { bookSlot, getAvailableSlots, updateSlot } from "../services/slot.service";

export const getSlots = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Missing query param: date" });

    const slots = await getAvailableSlots(date as string);
    res.json(slots);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const book = async (req: Request, res: Response) => {
  try {
    const { date, time, doseType } = req.body;
    const userId = req.body.userId || req.user?.id;
    const result = await bookSlot(userId, date, time, doseType);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateSlotController = async (req: Request, res: Response) => {
  try {
    const { userId, doseType, newDate, newTime } = req.body;

    const result = await updateSlot(userId, doseType, newDate, newTime);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
