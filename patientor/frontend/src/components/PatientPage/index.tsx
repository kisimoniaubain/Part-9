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
import type { PatientFull } from "../../types";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = useState<PatientFull | null>(null);

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

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  const GenderIcon =
    patient.gender === "male"
      ? MaleIcon
      : patient.gender === "female"
        ? FemaleIcon
        : TransgenderIcon;

  return (
    <Paper elevation={2} sx={{ padding: 3 }}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h4">
          {patient.name}
        </Typography>

        <GenderIcon />
      </Box>

      <Typography sx={{ marginTop: 2 }}>
        ssn: {patient.ssn}
      </Typography>

      <Typography>
        occupation: {patient.occupation}
      </Typography>

      <Typography>
        date of birth: {patient.dateOfBirth}
      </Typography>

      <Typography>
        gender: {patient.gender}
      </Typography>

      <Typography variant="h5" sx={{ marginTop: 3 }}>
        Entries
      </Typography>

      {patient.entries.length === 0 && (
        <Typography>
          No entries
        </Typography>
      )}
    </Paper>
  );
};

export default PatientPage;