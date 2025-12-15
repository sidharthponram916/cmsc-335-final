const express = require("express");
const router = express.Router();
const Entry = require("../Entry");

router.post("/", async (req, res) => {
  try {
    const entry = await Entry.create(req.body);
    return res.status(201).json(entry);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 });
    return res.json(entries);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    return res.json(entry);
  } catch (err) {
    return res.status(400).json({ error: "Invalid id" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Entry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Entry not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Entry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Entry not found" });
    return res.json({ message: "Deleted", id: deleted._id });
  } catch (err) {
    return res.status(400).json({ error: "Invalid id" });
  }
});

module.exports = router;
