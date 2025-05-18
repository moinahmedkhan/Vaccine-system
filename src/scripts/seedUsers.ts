import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { User } from "../models/Users";
import bcrypt from "bcryptjs";

dotenv.config();

const TOTAL_USERS = 1000000;
const BATCH_SIZE = 10000;

let phoneCounter = 9000000000;

const createFakeUser = async () => {
  const hashedPassword = await bcrypt.hash("dummy123", 10);
  return {
    name: faker.person.fullName(),
    phoneNumber: (phoneCounter++).toString(),
    password: hashedPassword,
    age: faker.number.int({ min: 18, max: 90 }),
    pincode: faker.location.zipCode("4520##"),
    aadharNumber: faker.string.numeric(12),
    vaccinationStatus: faker.helpers.arrayElement(["none", "firstDose", "fullyVaccinated"]),
  };
};

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("Connected to MongoDB");

  await User.deleteMany();
  console.log("Cleared users collection");

 for (let i = 0; i < TOTAL_USERS; i += BATCH_SIZE) {
  const batch = await Promise.all(
    Array.from({ length: BATCH_SIZE }).map(() => createFakeUser())
  );

  const inserted = await User.insertMany(batch);
  console.log(`Batch inserted: ${inserted.length} users`);
}

  console.log("All users inserted");
  process.exit();
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
