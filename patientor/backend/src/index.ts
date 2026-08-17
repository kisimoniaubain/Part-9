import express from "express";
import cors from "cors";
import { v1 as uuid } from "uuid";

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
  const patientsWithoutSsn = patients.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      entries,
    })
  );

  res.json(patientsWithoutSsn);
});

app.post("/api/patients", (req, res) => {
  const newPatient: Patient = {
    ...req.body,
    id: uuid(),
  };

  patients.push(newPatient);

  res.status(200).json(newPatient);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});