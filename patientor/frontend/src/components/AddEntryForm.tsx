import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import type { Entry } from "../types";
import { apiBaseUrl } from "../constants";

interface AddEntryFormProps {
  patientId: string;
  onEntryAdded: (entry: Entry) => void;
  onCancel: () => void;
}

type EntryType =
  | "HealthCheck"
  | "OccupationalHealthcare"
  | "Hospital";

interface EntryData {
  date: string;
  description: string;
  specialist: string;
  diagnosisCodes: string[];
  type: EntryType;

  healthCheckRating?: number;

  employerName?: string;

  sickLeave?: {
    startDate: string;
    endDate: string;
  };

  discharge?: {
    date: string;
    criteria: string;
  };
}

interface BackendErrorDetail {
  path?: string[];
  message?: string;
}

interface BackendError {
  error?: string;
  message?: string;
  details?: BackendErrorDetail[];
}

const AddEntryForm = ({
  patientId,
  onEntryAdded,
  onCancel,
}: AddEntryFormProps) => {
  const [entryType, setEntryType] =
    useState<EntryType>("HealthCheck");

  const [date, setDate] = useState("");
  const [description, setDescription] =
    useState("");
  const [specialist, setSpecialist] =
    useState("");
  const [diagnosisCodes, setDiagnosisCodes] =
    useState("");

  // HealthCheck
  const [healthCheckRating, setHealthCheckRating] =
    useState("");

  // OccupationalHealthcare
  const [employerName, setEmployerName] =
    useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] =
    useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] =
    useState("");

  // Hospital
  const [dischargeDate, setDischargeDate] =
    useState("");
  const [dischargeCriteria, setDischargeCriteria] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  const onTypeChange = (
    event: SelectChangeEvent
  ) => {
    setEntryType(
      event.target.value as EntryType
    );
    setError(null);
  };

  const submit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError(null);

    const parsedDiagnosisCodes =
      diagnosisCodes
        .split(",")
        .map((code) => code.trim())
        .filter(
          (code) => code.length > 0
        );

    const baseValues = {
      date,
      description,
      specialist,
      diagnosisCodes:
        parsedDiagnosisCodes,
    };

    let entryData: EntryData;

    /*
     * HealthCheck
     */
    if (entryType === "HealthCheck") {
      const rating =
        Number(healthCheckRating);

      if (
        healthCheckRating.trim() === "" ||
        !Number.isInteger(rating) ||
        rating < 0 ||
        rating > 3
      ) {
        setError(
          "healthCheckRating: invalid input"
        );
        return;
      }

      entryData = {
        ...baseValues,
        type: "HealthCheck",
        healthCheckRating: rating,
      };
    }

    /*
     * OccupationalHealthcare
     */
    else if (
      entryType ===
      "OccupationalHealthcare"
    ) {
      if (!employerName.trim()) {
        setError(
          "employerName: invalid input"
        );
        return;
      }

      entryData = {
        ...baseValues,
        type: "OccupationalHealthcare",
        employerName:
          employerName.trim(),
      };

      if (
        sickLeaveStartDate ||
        sickLeaveEndDate
      ) {
        entryData.sickLeave = {
          startDate:
            sickLeaveStartDate,
          endDate:
            sickLeaveEndDate,
        };
      }
    }

    /*
     * Hospital
     */
    else {
      if (!dischargeDate.trim()) {
        setError(
          "discharge.date: invalid input"
        );
        return;
      }

      if (!dischargeCriteria.trim()) {
        setError(
          "discharge.criteria: invalid input"
        );
        return;
      }

      entryData = {
        ...baseValues,
        type: "Hospital",
        discharge: {
          date: dischargeDate,
          criteria:
            dischargeCriteria.trim(),
        },
      };
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${apiBaseUrl}/patients/${patientId}/entries`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            entryData
          ),
        }
      );

      const responseText =
        await response.text();

      /*
       * Backend rejected the entry.
       */
      if (!response.ok) {
        let errorMessage =
          "Invalid input";

        try {
          const errorData =
            JSON.parse(
              responseText
            ) as BackendError;

          if (
            errorData.details &&
            errorData.details.length > 0
          ) {
            errorMessage =
              errorData.details
                .map((detail) => {
                  const field =
                    detail.path &&
                    detail.path.length > 0
                      ? detail.path.join(
                          "."
                        )
                      : "entry";

                  return `${field}: ${
                    detail.message ||
                    "invalid input"
                  }`;
                })
                .join("\n");
          } else if (
            errorData.error
          ) {
            errorMessage =
              errorData.error;
          } else if (
            errorData.message
          ) {
            errorMessage =
              errorData.message;
          }
        } catch {
          if (
            responseText.trim()
          ) {
            errorMessage =
              responseText;
          }
        }

        setError(errorMessage);
        return;
      }

      /*
       * Successful submission.
       */
      const newEntry =
        JSON.parse(
          responseText
        ) as Entry;

      onEntryAdded(newEntry);

      /*
       * Reset form.
       */
      setDate("");
      setDescription("");
      setSpecialist("");
      setDiagnosisCodes("");

      setHealthCheckRating("");

      setEmployerName("");
      setSickLeaveStartDate("");
      setSickLeaveEndDate("");

      setDischargeDate("");
      setDischargeCriteria("");

      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
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
        New Entry
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
        <FormControl
          fullWidth
          required
        >
          <InputLabel id="entry-type-label">
            Entry type
          </InputLabel>

          <Select
            labelId="entry-type-label"
            value={entryType}
            label="Entry type"
            onChange={onTypeChange}
          >
            <MenuItem value="HealthCheck">
              Health Check
            </MenuItem>

            <MenuItem value="OccupationalHealthcare">
              Occupational Healthcare
            </MenuItem>

            <MenuItem value="Hospital">
              Hospital
            </MenuItem>
          </Select>
        </FormControl>

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

        {/* HealthCheck fields */}
        {entryType ===
          "HealthCheck" && (
          <TextField
            label="Health Check Rating (0-3)"
            type="number"
            required
            value={healthCheckRating}
            error={
              error?.includes(
                "healthCheckRating"
              ) ?? false
            }
            helperText={
              error?.includes(
                "healthCheckRating"
              )
                ? "healthCheckRating: invalid input"
                : ""
            }
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
        )}

        {/* OccupationalHealthcare fields */}
        {entryType ===
          "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer Name"
              required
              value={employerName}
              onChange={(event) =>
                setEmployerName(
                  event.target.value
                )
              }
            />

            <Typography
              variant="subtitle2"
              sx={{ mt: 1 }}
            >
              Sick Leave (Optional)
            </Typography>

            <TextField
              label="Start Date"
              type="date"
              value={
                sickLeaveStartDate
              }
              onChange={(event) =>
                setSickLeaveStartDate(
                  event.target.value
                )
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              label="End Date"
              type="date"
              value={
                sickLeaveEndDate
              }
              onChange={(event) =>
                setSickLeaveEndDate(
                  event.target.value
                )
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </>
        )}

        {/* Hospital fields */}
        {entryType === "Hospital" && (
          <>
            <Typography
              variant="subtitle2"
              sx={{ mt: 1 }}
            >
              Discharge Details
            </Typography>

            <TextField
              label="Discharge Date"
              type="date"
              required
              value={dischargeDate}
              onChange={(event) =>
                setDischargeDate(
                  event.target.value
                )
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              label="Discharge Criteria"
              required
              value={
                dischargeCriteria
              }
              onChange={(event) =>
                setDischargeCriteria(
                  event.target.value
                )
              }
            />
          </>
        )}

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
            mt: 1,
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