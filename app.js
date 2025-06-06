import express from "express";
import morgan from "morgan";
import cors from "cors";
import { connectToDB, sequelize } from "./config/db.js";
import helmet from "helmet";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.static('public'));

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const startServer = async () => {
  try {
    await connectToDB();
    await sequelize.sync();
    
    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error("Cannot start server:", error.message);
    process.exit(1);
  }
};

startServer();