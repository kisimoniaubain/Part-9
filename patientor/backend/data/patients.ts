import {
  HospitalEntry,
  OccupationalHealthcareEntry,
  Patient,
} from "../src/types";

const johnHospitalEntry: HospitalEntry = {
  id: "d811e46d-70b3-4d90-b090-4535c7cf8fb1",
  date: "2015-01-02",
  type: "Hospital",
  specialist: "MD House",
  diagnosisCodes: ["S62.5"],
  description:
    "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
  discharge: {
    date: "2015-01-16",
    criteria: "Thumb has healed.",
  },
};

const martinOccupationalEntry: OccupationalHealthcareEntry = {
  id: "d811e46d-70b3-4d90-b090-4535c7cf8fb2",
  date: "2019-08-05",
  type: "OccupationalHealthcare",
  specialist: "Dr. House",
  employerName: "Acme Corporation",
  description: "Patient has been feeling tired at work.",
  sickLeave: {
    startDate: "2019-08-05",
    endDate: "2019-08-10",
  },
};

const patients: Patient[] = [
  {
    id: "d2773336-f723-11e9-8f0b-362b9e155667",
    name: "John McClane",
    dateOfBirth: "1986-07-09",
    ssn: "090786-122X",
    gender: "male",
    occupation: "New york city cop",
    entries: [johnHospitalEntry],
  },

  {
    id: "d2773598-f723-11e9-8f0b-362b9e155667",
    name: "Martin Riggs",
    dateOfBirth: "1979-01-30",
    ssn: "300179-123A",
    gender: "male",
    occupation: "Cop",
    entries: [martinOccupationalEntry],
  },
];

export default patients;