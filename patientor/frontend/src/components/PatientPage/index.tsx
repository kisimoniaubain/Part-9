import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";

import { apiBaseUrl } from "../../constants";
import type {
  PatientFull,
  Diagnosis,
} from "../../types";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = useState<PatientFull | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        return;
      }

      const response = await fetch(`${apiBaseUrl}/patients/${id}`);

      if (!response.ok) {
        return;
      }

      const data: PatientFull = await response.json();
      setPatient(data);
    };

    void fetchPatient();
  }, [id]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const response = await fetch(`${apiBaseUrl}/diagnoses`);

      if (!response.ok) {
        return;
      }

      const data: Diagnosis[] = await response.json();
      setDiagnoses(data);
    };

    void fetchDiagnoses();
  }, []);

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  const GenderIcon =
    patient.gender === "male"
      ? MaleIcon
      : patient.gender === "female"
        ? FemaleIcon
        : TransgenderIcon;

  const getDiagnosisDescription = (code: string): string => {
    const diagnosis = diagnoses.find(
      (diagnosis) => diagnosis.code === code
    );

    return diagnosis?.name ?? "Unknown diagnosis";
  };

  return (
    <Paper elevation={2} sx={{ padding: 3 }}>
      {/* Patient information */}
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h4">
          {patient.name}
        </Typography>

        <GenderIcon />
      </Box>

      <Typography>
        ssn: {patient.ssn}
      </Typography>

      <Typography>
        occupation: {patient.occupation}
      </Typography>

      {/* Entries */}
      <Typography variant="h5" sx={{ marginTop: 3 }}>
        Entries
      </Typography>

      {patient.entries.map((entry) => (
        <Paper
          key={entry.id}
          variant="outlined"
          sx={{
            padding: 2,
            marginTop: 2,
          }}
        >
          <Typography variant="h6">
            {entry.date}
          </Typography>

          <Typography>
            {entry.description}
          </Typography>

          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
            <Box component="ul" sx={{ marginTop: 1 }}>
              {entry.diagnosisCodes.map((code) => (
                <li key={code}>
                  <Typography component="span">
                    {code} {getDiagnosisDescription(code)}
                  </Typography>
                </li>
              ))}
            </Box>
          )}
        </Paper>
      ))}
    </Paper>
  );
};

export default PatientPage;