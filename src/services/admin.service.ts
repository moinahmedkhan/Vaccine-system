import { Admin } from "../models/Admin";
import { User } from "../models/Users";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (username: string, password: string) => {
  const admin = await Admin.findOne({ username });
  if (!admin) throw new Error("Invalid username or password");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("Invalid username or password");

  const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return { message: "Admin login successful", token };
};

interface UserFilter {
  age?: number;
  pincode?: string;
  vaccinationStatus?: "none" | "firstDose" | "fullyVaccinated";
}

export const filterUsers = async (filters: UserFilter) => {
  const query: any = {};

  if (filters.age) query.age = { $gte: filters.age };
  if (filters.pincode) query.pincode = filters.pincode;
  if (filters.vaccinationStatus) query.vaccinationStatus = filters.vaccinationStatus;

  const start = Date.now();

  const users = await User.find(query).select("-password");

  const end = Date.now();
  console.log("Admin filter query log:");
  console.log("Query:", query);
  console.log("Total Results:", users.length);
  console.log("Time Taken (ms):", end - start);

  return users;
};