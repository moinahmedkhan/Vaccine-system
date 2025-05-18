import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import userRoutes from "./routes/user.routes";
import slotRoutes from "./routes/slot.routes";
import adminRoutes from "./routes/admin.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Vaccine API is running!");
});

app.use("/api/users", userRoutes);  // Users
app.use("/api/slots", slotRoutes);  //  Slots

//Admin
app.use("/api/admin", adminRoutes);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
