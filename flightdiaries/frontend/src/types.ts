export interface DiaryEntry {
  id: number;
  weather: string;
  visibility: string;
  date: string;
}

export type NewDiaryEntry = Omit<DiaryEntry, "id"> & {
  comment?: string;
};