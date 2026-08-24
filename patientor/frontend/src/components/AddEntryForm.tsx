import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import type { Entry, Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";

interface AddEntryFormProps {
  patientId: string;
  onEntryAdded: (entry: Entry) => void;
  onCancel: () => void;
  diagnoses?: Diagnosis[];
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
  diagnoses = [],
}: AddEntryFormProps) => {
  const [entryType, setEntryType] =
    useState<EntryType>("HealthCheck");

  const [date, setDate] = useState("");
  const [description, setDescription] =
    useState("");
  const [specialist, setSpecialist] =
    useState("");

  const [diagnosisCodes, setDiagnosisCodes] =
    useState<string[]>([]);

  /*
   * Default HealthCheck rating to 0 (Healthy).
   *
   * This is a valid rating and allows the E2E test
   * to submit a HealthCheck entry without manually
   * selecting a rating.
   */
  const [healthCheckRating, setHealthCheckRating] =
    useState<number | "">(0);

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

  /*
   * Entry type
   */
  const onTypeChange = (
    event: SelectChangeEvent<EntryType>
  ) => {
    setEntryType(
      event.target.value as EntryType
    );

    setError(null);
  };

  /*
   * HealthCheck rating
   */
  const onHealthCheckRatingChange = (
    event: SelectChangeEvent<number>
  ) => {
    setHealthCheckRating(
      Number(event.target.value)
    );

    setError(null);
  };

  /*
   * Diagnosis code multiple select
   */
  const onDiagnosisChange = (
    event: SelectChangeEvent<string[]>
  ) => {
    const value = event.target.value;

    setDiagnosisCodes(
      typeof value === "string"
        ? value.split(",")
        : value
    );

    setError(null);
  };

  /*
   * Submit
   */
  const submit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError(null);

    /*
     * Basic frontend validation
     */
    if (!date) {
      setError("date: invalid input");
      return;
    }

    if (!description.trim()) {
      setError(
        "description: invalid input"
      );
      return;
    }

    if (!specialist.trim()) {
      setError(
        "specialist: invalid input"
      );
      return;
    }

    /*
     * HealthCheck
     */
    if (
      entryType === "HealthCheck" &&
      healthCheckRating === ""
    ) {
      setError(
        "healthCheckRating: invalid input"
      );
      return;
    }

    /*
     * OccupationalHealthcare
     */
    if (
      entryType ===
        "OccupationalHealthcare" &&
      !employerName.trim()
    ) {
      setError(
        "employerName: invalid input"
      );
      return;
    }

    /*
     * Hospital
     */
    if (
      entryType === "Hospital" &&
      !dischargeDate
    ) {
      setError(
        "discharge.date: invalid input"
      );
      return;
    }

    if (
      entryType === "Hospital" &&
      !dischargeCriteria.trim()
    ) {
      setError(
        "discharge.criteria: invalid input"
      );
      return;
    }

    /*
     * Common entry values
     */
    const baseValues = {
      date,
      description: description.trim(),
      specialist: specialist.trim(),
      diagnosisCodes,
    };

    let entryData: EntryData;

    /*
     * HealthCheck
     */
    if (entryType === "HealthCheck") {
      entryData = {
        ...baseValues,
        type: "HealthCheck",
        healthCheckRating:
          healthCheckRating as number,
      };
    }

    /*
     * OccupationalHealthcare
     */
    else if (
      entryType ===
      "OccupationalHealthcare"
    ) {
      entryData = {
        ...baseValues,
        type: "OccupationalHealthcare",
        employerName: employerName.trim(),
      };

      /*
       * Only send sickLeave when at least
       * one date was entered.
       */
      if (
        sickLeaveStartDate ||
        sickLeaveEndDate
      ) {
        entryData.sickLeave = {
          startDate: sickLeaveStartDate,
          endDate: sickLeaveEndDate,
        };
      }
    }

    /*
     * Hospital
     */
    else {
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

      /*
       * Immediately add the new entry
       * to the PatientPage.
       */
      onEntryAdded(newEntry);

      /*
       * Reset form.
       */
      setDate("");
      setDescription("");
      setSpecialist("");
      setDiagnosisCodes([]);

      /*
       * Reset HealthCheck to the
       * valid default rating.
       */
      setHealthCheckRating(0);

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
        {/* Entry Type */}

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

        {/* Date */}

        <TextField
          label="Date"
          type="date"
          required
          fullWidth
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

        {/* Description */}

        <TextField
          label="Description"
          required
          fullWidth
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
        />

        {/* Specialist */}

        <TextField
          label="Specialist"
          required
          fullWidth
          value={specialist}
          onChange={(event) =>
            setSpecialist(
              event.target.value
            )
          }
        />

        {/* HealthCheck */}

        {entryType ===
          "HealthCheck" && (
          <FormControl
            fullWidth
            required
          >
            <InputLabel id="health-rating-label">
              Health Check Rating
            </InputLabel>

            <Select
              labelId="health-rating-label"
              value={healthCheckRating}
              label="Health Check Rating"
              onChange={
                onHealthCheckRatingChange
              }
            >
              <MenuItem value={0}>
                0 — Healthy
              </MenuItem>

              <MenuItem value={1}>
                1 — Low Risk
              </MenuItem>

              <MenuItem value={2}>
                2 — High Risk
              </MenuItem>

              <MenuItem value={3}>
                3 — Critical Risk
              </MenuItem>
            </Select>
          </FormControl>
        )}

        {/* OccupationalHealthcare */}

        {entryType ===
          "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer Name"
              required
              fullWidth
              value={employerName}
              onChange={(event) =>
                setEmployerName(
                  event.target.value
                )
              }
            />

            <Typography
              variant="subtitle2"
            >
              Sick Leave (Optional)
            </Typography>

            <TextField
              label="Start Date"
              type="date"
              fullWidth
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
              fullWidth
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

        {/* Hospital */}

        {entryType ===
          "Hospital" && (
          <>
            <Typography
              variant="subtitle2"
            >
              Discharge Details
            </Typography>

            <TextField
              label="Discharge Date"
              type="date"
              required
              fullWidth
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
              fullWidth
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

        {/* Diagnosis Codes */}

        <FormControl fullWidth>
          <InputLabel id="diagnosis-label">
            Diagnosis Codes
          </InputLabel>

          <Select
            labelId="diagnosis-label"
            multiple
            value={diagnosisCodes}
            onChange={
              onDiagnosisChange
            }
            input={
              <OutlinedInput label="Diagnosis Codes" />
            }
            renderValue={(selected) => (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                }}
              >
                {selected.map(
                  (code) => (
                    <Chip
                      key={code}
                      label={code}
                    />
                  )
                )}
              </Box>
            )}
          >
            {diagnoses.map(
              (diagnosis) => (
                <MenuItem
                  key={
                    diagnosis.code
                  }
                  value={
                    diagnosis.code
                  }
                >
                  {diagnosis.code} —{" "}
                  {diagnosis.name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        {/* Buttons */}

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