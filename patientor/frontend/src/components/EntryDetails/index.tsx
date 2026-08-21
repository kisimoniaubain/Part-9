import {
  Box,
  Typography,
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";

import type { Entry } from "../../types";

interface EntryDetailsProps {
  entry: Entry;
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry }: EntryDetailsProps) => {
  switch (entry.type) {
    case "HealthCheck":
      return (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 1,
            }}
          >
            <FavoriteIcon
              sx={{
                color:
                  entry.healthCheckRating === 0
                    ? "green"
                    : entry.healthCheckRating === 1
                      ? "yellow"
                      : entry.healthCheckRating === 2
                        ? "orange"
                        : "red",
              }}
            />
          </Box>

          <Typography sx={{ mt: 1 }}>
            diagnose by {entry.specialist}
          </Typography>
        </>
      );

    case "Hospital":
      return (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <MedicalServicesIcon />
          </Box>

          <Typography>
            diagnose by {entry.specialist}
          </Typography>
        </>
      );

    case "OccupationalHealthcare":
      return (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <MedicalServicesIcon />

            <Typography
              component="span"
              sx={{ fontStyle: "italic", fontWeight: "bold" }}
            >
              {entry.employerName}
            </Typography>
          </Box>

          <Typography sx={{ mt: 1 }}>
            diagnose by {entry.specialist}
          </Typography>
        </>
      );

    default:
      return assertNever(entry);
  }
};

export default EntryDetails;