import express from "express";
import cors from "cors";
import { v1 as uuid } from "uuid";

import diagnoses from "../data/diagnoses";
import patients from "../data/patients";
import {
  NewPatientSchema,
  NewEntrySchema,
  Patient,
} from "./types";

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

app.get("/api/patients/:id", (req, res) => {
  const patient = patients.find(
    (patient) => patient.id === req.params.id
  );

  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({
      error: "Patient not found",
    });
  }
});

app.post("/api/patients", (req, res) => {
  const result = NewPatientSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid patient data",
    });
  }

  const newPatient: Patient = {
    ...result.data,
    id: uuid(),
    entries: [],
  };

  patients.push(newPatient);

  return res.status(200).json(newPatient);
});

/*
 * Exercise 9.29
 * Add a new entry to a patient
 */
app.post("/api/patients/:id/entries", (req, res) => {
  const patient = patients.find(
    (patient) => patient.id === req.params.id
  );

  if (!patient) {
    return res.status(404).json({
      error: "Patient not found",
    });
  }

  const result = NewEntrySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid entry data",
      details: result.error.issues,
    });
  }

  const newEntry = {
    ...result.data,
    id: uuid(),
  };

  patient.entries.push(newEntry);

  return res.status(201).json(newEntry);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});