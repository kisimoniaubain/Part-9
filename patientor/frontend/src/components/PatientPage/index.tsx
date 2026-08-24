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

import AddEntryForm from "../AddEntryForm";
import EntryDetails from "../EntryDetails";

import { apiBaseUrl } from "../../constants";

import type {
  PatientFull,
  Diagnosis,
  Entry,
} from "../../types";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();

  /*
   * Controls whether the Add Entry form
   * is visible.
   */
  const [showAddEntryForm, setShowAddEntryForm] =
    useState(false);

  const [patient, setPatient] =
    useState<PatientFull | null>(null);

  const [diagnoses, setDiagnoses] =
    useState<Diagnosis[]>([]);

  /*
   * Fetch patient
   */
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

  /*
   * Fetch diagnoses
   */
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

  /*
   * Loading
   */
  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  /*
   * Gender icon
   */
  const GenderIcon =
    patient.gender === "male"
      ? MaleIcon
      : patient.gender === "female"
        ? FemaleIcon
        : TransgenderIcon;

  /*
   * Get diagnosis description
   */
  const getDiagnosisDescription = (
    code: string
  ): string => {
    const diagnosis = diagnoses.find(
      (diagnosis) =>
        diagnosis.code === code
    );

    return (
      diagnosis?.name ??
      "Unknown diagnosis"
    );
  };

  /*
   * Called when a new entry has been
   * successfully added.
   */
  const handleEntryAdded = (
    entry: Entry
  ) => {
    setPatient((currentPatient) => {
      if (!currentPatient) {
        return currentPatient;
      }

      return {
        ...currentPatient,
        entries: [
          ...currentPatient.entries,
          entry,
        ],
      };
    });

    /*
     * Hide the form after successful
     * submission.
     */
    setShowAddEntryForm(false);
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
      {/* =========================
          Patient information
          ========================= */}

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
        <strong>ssn:</strong>{" "}
        {patient.ssn}
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

      {/* =========================
          Add New Entry button
          ========================= */}

      {!showAddEntryForm && (
        <Box
          sx={{
            mt: 3,
          }}
        >
          <Button
            variant="contained"
            type="button"
            onClick={() =>
              setShowAddEntryForm(true)
            }
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
      )}

      {/* =========================
          Add Entry Form

          IMPORTANT:
          This is ABOVE the Entries
          section.
          ========================= */}

      {showAddEntryForm && (
        <Box sx={{ mt: 3 }}>
          <AddEntryForm
            patientId={patient.id}
            diagnoses={diagnoses}
            onEntryAdded={
              handleEntryAdded
            }
            onCancel={() =>
              setShowAddEntryForm(false)
            }
          />
        </Box>
      )}

      {/* =========================
          Entries heading
          ========================= */}

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

      {/* =========================
          Entries
          ========================= */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {patient.entries.map(
          (entry) => (
            <Paper
              key={entry.id}
              variant="outlined"
              sx={{
                border:
                  "1px solid #9e9e9e",
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
                    fontSize:
                      "0.95rem",
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
                  fontSize:
                    "0.95rem",
                  mb: 1.5,
                }}
              >
                {entry.description}
              </Typography>

              {/* Entry-specific details */}

              <EntryDetails
                entry={entry}
              />

              {/* Diagnosis codes */}

              {entry.diagnosisCodes &&
                entry.diagnosisCodes
                  .length > 0 && (
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
                              fontFamily:
                                "serif",
                              fontSize:
                                "0.9rem",
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
          )
        )}
      </Box>
    </Paper>
  );
};

export default PatientPage;