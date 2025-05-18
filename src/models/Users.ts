import mongoose from "mongoose";

export type VaccinationStatus = "none" | "firstDose" | "fullyVaccinated";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  pincode: { type: String, required: true },
  aadharNumber: { type: String, required: true, unique: true },
  vaccinationStatus: {
    type: String,
    enum: ["none", "firstDose", "fullyVaccinated"],
    default: "none",
  },
  firstDoseSlot: { type: Date },
  secondDoseSlot: { type: Date },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
