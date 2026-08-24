import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import type { Entry } from "../types";
import { apiBaseUrl } from "../constants";

interface AddEntryFormProps {
  patientId: string;
  onEntryAdded: (entry: Entry) => void;
  onCancel: () => void;
}

const AddEntryForm = ({
  patientId,
  onEntryAdded,
  onCancel,
}: AddEntryFormProps) => {
  const [date, setDate] = useState("");
  const [description, setDescription] =
    useState("");
  const [specialist, setSpecialist] =
    useState("");
  const [healthCheckRating, setHealthCheckRating] =
    useState("");
  const [diagnosisCodes, setDiagnosisCodes] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  const submit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError(null);

    /*
     * Validate HealthCheck rating before
     * sending anything to the backend.
     */
    const rating = Number(
      healthCheckRating
    );

    if (
      healthCheckRating.trim() === "" ||
      !Number.isInteger(rating) ||
      rating < 0 ||
      rating > 3
    ) {
      setError(
        "healthCheckRating: Invalid input"
      );
      return;
    }

    setSubmitting(true);

    const body = {
      date,
      type: "HealthCheck",
      description,
      specialist,
      healthCheckRating: rating,
      diagnosisCodes: diagnosisCodes
        .split(",")
        .map((code) => code.trim())
        .filter(
          (code) => code.length > 0
        ),
    };

    try {
      const response = await fetch(
        `${apiBaseUrl}/patients/${patientId}/entries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const responseText =
        await response.text();

      if (!response.ok) {
        let errorMessage =
          "Invalid input";

        try {
          const errorData =
            JSON.parse(responseText);

          if (
            Array.isArray(
              errorData.details
            ) &&
            errorData.details.length > 0
          ) {
            errorMessage =
              errorData.details
                .map(
                  (detail: {
                    path?: string[];
                    message?: string;
                  }) => {
                    const field =
                      Array.isArray(
                        detail.path
                      ) &&
                      detail.path.length > 0
                        ? detail.path.join(
                            "."
                          )
                        : "entry";

                    const message =
                      detail.message ||
                      "Invalid input";

                    return `${field}: ${message}`;
                  }
                )
                .join("\n");
          } else if (
            typeof errorData.error ===
            "string"
          ) {
            errorMessage =
              errorData.error;
          } else if (
            typeof errorData.message ===
            "string"
          ) {
            errorMessage =
              errorData.message;
          }
        } catch {
          if (responseText.trim()) {
            errorMessage =
              responseText;
          }
        }

        setError(errorMessage);
        return;
      }

      const newEntry: Entry =
        JSON.parse(responseText);

      onEntryAdded(newEntry);

      setDate("");
      setDescription("");
      setSpecialist("");
      setHealthCheckRating("");
      setDiagnosisCodes("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to add entry"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        border: "1px dashed #333",
        borderRadius: 1,
        p: 3,
        mb: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        New HealthCheck Entry
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            whiteSpace: "pre-line",
          }}
        >
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={submit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Date"
          type="date"
          required
          value={date}
          onChange={(event) =>
            setDate(event.target.value)
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          label="Description"
          required
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
        />

        <TextField
          label="Specialist"
          required
          value={specialist}
          onChange={(event) =>
            setSpecialist(
              event.target.value
            )
          }
        />

        <TextField
          label="Health Check Rating (0-3)"
          type="number"
          required
          value={healthCheckRating}
          onChange={(event) => {
            setHealthCheckRating(
              event.target.value
            );
            setError(null);
          }}
          inputProps={{
            min: 0,
            max: 3,
          }}
        />

        <TextField
          label="Diagnosis Codes (comma-separated)"
          value={diagnosisCodes}
          onChange={(event) =>
            setDiagnosisCodes(
              event.target.value
            )
          }
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
          >
            {submitting
              ? "ADDING..."
              : "ADD"}
          </Button>

          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={submitting}
          >
            CANCEL
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddEntryForm;