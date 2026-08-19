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
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../../types";

const HospitalEntryDetails = ({
  entry,
}: {
  entry: HospitalEntry;
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{ padding: 2, marginTop: 2 }}
    >
      <Typography variant="h6">
        Hospital
      </Typography>

      <Typography>
        date: {entry.date}
      </Typography>

      <Typography>
        specialist: {entry.specialist}
      </Typography>

      <Typography>
        description: {entry.description}
      </Typography>

      {entry.diagnosisCodes && (
        <Typography>
          diagnosis codes: {entry.diagnosisCodes.join(", ")}
        </Typography>
      )}

      <Typography>
        discharge date: {entry.discharge.date}
      </Typography>

      <Typography>
        discharge criteria: {entry.discharge.criteria}
      </Typography>
    </Paper>
  );
};

const OccupationalHealthcareEntryDetails = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{ padding: 2, marginTop: 2 }}
    >
      <Typography variant="h6">
        Occupational Healthcare
      </Typography>

      <Typography>
        date: {entry.date}
      </Typography>

      <Typography>
        specialist: {entry.specialist}
      </Typography>

      <Typography>
        employer: {entry.employerName}
      </Typography>

      <Typography>
        description: {entry.description}
      </Typography>

      {entry.diagnosisCodes && (
        <Typography>
          diagnosis codes: {entry.diagnosisCodes.join(", ")}
        </Typography>
      )}

      {entry.sickLeave && (
        <>
          <Typography>
            sick leave start: {entry.sickLeave.startDate}
          </Typography>

          <Typography>
            sick leave end: {entry.sickLeave.endDate}
          </Typography>
        </>
      )}
    </Paper>
  );
};

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

      {patient.entries.map((entry) => {
        switch (entry.type) {
          case "Hospital":
            return (
              <HospitalEntryDetails
                key={entry.id}
                entry={entry}
              />
            );

          case "OccupationalHealthcare":
            return (
              <OccupationalHealthcareEntryDetails
                key={entry.id}
                entry={entry}
              />
            );

          default:
            return null;
        }
      })}
    </Paper>
  );
};

export default PatientPage;