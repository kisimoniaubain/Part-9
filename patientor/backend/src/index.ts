import express from "express";
import cors from "cors";

import diagnoses from "../data/diagnoses";
import patients from "../data/patients";

import { Patient } from "./types";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

app.get("/api/diagnoses", (_req, res) => {
  res.json(diagnoses);
});

app.get("/api/patients", (_req, res) => {
  const patientsWithoutSsn: Pick<
    Patient,
    "id" | "name" | "dateOfBirth" | "gender" | "occupation"
  >[] = patients.map(
    ({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    })
  );

  res.json(patientsWithoutSsn);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});