import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Button,
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

import EntryDetails from "../EntryDetails";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] =
    useState<PatientFull | null>(null);

  const [diagnoses, setDiagnoses] =
    useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        return;
      }

      const response = await fetch(
        `${apiBaseUrl}/patients/${id}`
      );

      if (!response.ok) {
        return;
      }

      const data: PatientFull =
        await response.json();

      setPatient(data);
    };

    void fetchPatient();
  }, [id]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const response = await fetch(
        `${apiBaseUrl}/diagnoses`
      );

      if (!response.ok) {
        return;
      }

      const data: Diagnosis[] =
        await response.json();

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

  const getDiagnosisDescription = (
    code: string
  ): string => {
    const diagnosis = diagnoses.find(
      (diagnosis) => diagnosis.code === code
    );

    return diagnosis?.name ?? "Unknown diagnosis";
  };

  return (
    <Paper
      elevation={2}
      sx={{
        padding: 3,
        maxWidth: 900,
        margin: "0 auto",
        backgroundColor: "white",
      }}
    >
      {/* Patient information */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "serif",
            fontWeight: "bold",
          }}
        >
          {patient.name}
        </Typography>

        <GenderIcon />
      </Box>

      <Typography
        sx={{
          fontFamily: "serif",
          fontSize: "0.95rem",
          mb: 0.5,
        }}
      >
        <strong>ssn:</strong> {patient.ssn}
      </Typography>

      <Typography
        sx={{
          fontFamily: "serif",
          fontSize: "0.95rem",
        }}
      >
        <strong>occupation:</strong>{" "}
        {patient.occupation}
      </Typography>

      {/* Entries */}

      <Typography
        variant="h5"
        sx={{
          mt: 4,
          mb: 2,
          fontFamily: "serif",
          fontWeight: "bold",
        }}
      >
        Entries
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {patient.entries.map((entry) => (
          <Paper
            key={entry.id}
            variant="outlined"
            sx={{
              border: "1px solid #9e9e9e",
              borderRadius: "6px",
              padding: 2,
              boxShadow: "none",
              backgroundColor: "#fff",
            }}
          >
            {/* Entry date */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "serif",
                  fontSize: "0.95rem",
                }}
              >
                {entry.date}
              </Typography>
            </Box>

            {/* Entry description */}

            <Typography
              sx={{
                fontFamily: "serif",
                fontStyle: "italic",
                fontSize: "0.95rem",
                mb: 1.5,
              }}
            >
              {entry.description}
            </Typography>

            {/* Entry-specific details */}

            <EntryDetails entry={entry} />

            {/* Diagnosis codes */}

            {entry.diagnosisCodes &&
              entry.diagnosisCodes.length > 0 && (
                <Box
                  component="ul"
                  sx={{
                    mt: 2,
                    mb: 0,
                    pl: 3,
                  }}
                >
                  {entry.diagnosisCodes.map(
                    (code) => (
                      <li key={code}>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "serif",
                            fontSize: "0.9rem",
                          }}
                        >
                          {code}{" "}
                          {getDiagnosisDescription(
                            code
                          )}
                        </Typography>
                      </li>
                    )
                  )}
                </Box>
              )}
          </Paper>
        ))}
      </Box>

      {/* Add New Entry */}

      <Box
        sx={{
          mt: 3,
        }}
      >
        <Button
          variant="contained"
          type="button"
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            fontWeight: 500,
            fontSize: "0.875rem",
            textTransform: "uppercase",
            padding: "8px 16px",
            borderRadius: "4px",
            boxShadow:
              "0 2px 4px rgba(0, 0, 0, 0.2)",

            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Add New Entry
        </Button>
      </Box>
    </Paper>
  );
};

export default PatientPage;