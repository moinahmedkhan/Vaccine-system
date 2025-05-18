import { Request, Response } from "express";
import { loginAdmin } from "../services/admin.service";
import { filterUsers } from "../services/admin.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await loginAdmin(username, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

export const getFilteredUsers = async (req: Request, res: Response) => {
  try {
    const { age, pincode, vaccinationStatus } = req.query;

    const result = await filterUsers({
      age: age ? Number(age) : undefined,
      pincode: pincode as string,
      vaccinationStatus: vaccinationStatus as any,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};