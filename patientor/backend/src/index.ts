import express from "express";
import cors from "cors";
import diagnoses from "../data/diagnoses";

const app = express();

const PORT = 3001;

app.use(cors());

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

app.get("/api/diagnoses", (_req, res) => {
  res.json(diagnoses);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});