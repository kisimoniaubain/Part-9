import express from "express";
import cors from "cors";
import { v1 as uuid } from "uuid";

import diagnoses from "../data/diagnoses";
import patients from "../data/patients";
import { Gender, NewPatient, Patient } from "./types";

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

const isString = (text: unknown): text is string => {
  return typeof text === "string";
};

const isGender = (param: unknown): param is Gender => {
  return Object.values(Gender).includes(param as Gender);
};

const isNewPatient = (object: unknown): object is NewPatient => {
  if (!object || typeof object !== "object") {
    return false;
  }

  const patient = object as Record<string, unknown>;

  return (
    isString(patient.name) &&
    isString(patient.dateOfBirth) &&
    isString(patient.ssn) &&
    isGender(patient.gender) &&
    isString(patient.occupation)
  );
};

app.post("/api/patients", (req, res) => {
  if (!isNewPatient(req.body)) {
    return res.status(400).json({
      error: "Invalid patient data"
    });
  }

  const newPatient: Patient = {
    ...req.body,
    id: uuid(),
    entries: []
  };

  patients.push(newPatient);

  return res.status(200).json(newPatient);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});