export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export const Gender = {
  Male: "male",
  Female: "female",
  Other: "other",
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth: string;
}

export interface PatientFull extends Patient {
  ssn: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, "id">;