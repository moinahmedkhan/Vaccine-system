import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true }, // format: YYYY-MM-DD
  time: { type: String, required: true }, // format: HH:mm
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {
  timestamps: true,
});

slotSchema.index({ date: 1, time: 1 }, { unique: true });

export const Slot = mongoose.model("Slot", slotSchema);
