import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "../models/Admin";
import bcrypt from "bcryptjs";

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  const existing = await Admin.findOne({ username: "admin" });
  if (existing) {
    console.log("Admin already exists.");
    return process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await Admin.create({
    username: "admin",
    password: hashedPassword,
  });

  console.log("Admin seeded successfully");
  process.exit();
};

seedAdmin();
