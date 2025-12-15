require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const entriesRouter = require("./routes/entries");
app.use("/api/entries", entriesRouter);

app.get("/", (req, res) => {
  res.send("Welcome to World Bucket List!");
});

const PORT = process.env.PORT || 5000;

async function startDatabase() {
  try {
    if (!process.env.DB_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.DB_URI);

    console.log("MongoDB connected");
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

startDatabase();

app.listen(PORT, () => {
  console.log(`Starting WorldBucketList Server @ ${PORT}`);
});
