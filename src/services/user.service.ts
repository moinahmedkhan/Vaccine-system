import { User } from "../models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const registerUser = async (userData: any) => {
  const { phoneNumber, aadharNumber, password } = userData;

  // Check if user exists
  const existing = await User.findOne({ $or: [{ phoneNumber }, { aadharNumber }] });
  if (existing) {
    throw new Error("User already registered with phone or Aadhar");
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  userData.password = hashedPassword;

  // Create user
  const user = new User(userData);
  await user.save();

  return { message: "User registered successfully", userId: user._id };
};

export const loginUser = async (phoneNumber: string, password: string) => {
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return {
    message: "Login successful",
    token,
    user: {
      name: user.name,
      phoneNumber: user.phoneNumber,
      age: user.age,
      pincode: user.pincode,
      vaccinationStatus: user.vaccinationStatus,
    },
  };
};
