import { Slot } from "../models/Slot";
import { User } from "../models/Users";

export const getAvailableSlots = async (date: string) => {
  const slots = await Slot.find({ date });
  const available = slots.filter(slot => slot.registeredUsers.length < 10);
  return available;
};

export const bookSlot = async (userId: string, date: string, time: string, doseType: "first" | "second") => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (doseType === "second" && user.vaccinationStatus !== "firstDose") {
    throw new Error("User must complete first dose before booking second");
  }

  // Prevent booking same slot again
  const existing = await Slot.findOne({ date, time, registeredUsers: userId });
  if (existing) throw new Error("Already registered for this slot");

  // Fetch or create the slot
  const slot = await Slot.findOneAndUpdate(
    { date, time },
    { $addToSet: { registeredUsers: userId } },
    { upsert: true, new: true }
  );

  if (slot.registeredUsers.length > 10) {
    // Rollback if overbooked
    await Slot.updateOne({ _id: slot._id }, { $pull: { registeredUsers: userId } });
    throw new Error("Slot is full");
  }

  if (doseType === "first") {
    user.vaccinationStatus = "firstDose";
    user.firstDoseSlot = new Date(`${date}T${time}:00`);
  } else {
    user.vaccinationStatus = "fullyVaccinated";
    user.secondDoseSlot = new Date(`${date}T${time}:00`);
  }

  await user.save();
  return { message: `${doseType} dose booked successfully` };
};



export const updateSlot = async (
  userId: string,
  doseType: "first" | "second",
  newDate: string,
  newTime: string
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const bookedSlotDate =
    doseType === "first" ? user.firstDoseSlot : user.secondDoseSlot;

  if (!bookedSlotDate) throw new Error(`No existing ${doseType} dose booking`);

  const now = new Date();
  const diff = new Date(bookedSlotDate).getTime() - now.getTime();
  const hoursBefore = diff / (1000 * 60 * 60);

  if (hoursBefore < 24) {
    throw new Error("Slot can't be changed within 24 hours");
  }

  // Remove user from old slot
  await Slot.updateOne(
    { date: bookedSlotDate.toISOString().split("T")[0], time: bookedSlotDate.toTimeString().substring(0, 5) },
    { $pull: { registeredUsers: userId } }
  );

  // Add user to new slot
  const updatedSlot = await Slot.findOneAndUpdate(
    { date: newDate, time: newTime },
    { $addToSet: { registeredUsers: userId } },
    { upsert: true, new: true }
  );

  if (updatedSlot.registeredUsers.length > 10) {
    await Slot.updateOne(
      { _id: updatedSlot._id },
      { $pull: { registeredUsers: userId } }
    );
    throw new Error("New slot is full");
  }

  // Update user's slot
  const newSlotDateTime = new Date(`${newDate}T${newTime}:00`);
  if (doseType === "first") user.firstDoseSlot = newSlotDateTime;
  else user.secondDoseSlot = newSlotDateTime;

  await user.save();

  return { message: "Slot updated successfully" };
};