import { useEffect, useState } from "react";
import type { DiaryEntry } from "./types";
import "./App.css";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/diaries")
      .then((response) => response.json())
      .then((data: DiaryEntry[]) => {
        setDiaries(data);
      });
  }, []);

return (
  <div>
    <h1>Flight Diaries</h1>

    {diaries.map((diary) => (
      <div className="diary" key={diary.id}>
        <h2>{diary.date}</h2>
        <p>Weather: {diary.weather}</p>
        <p>Visibility: {diary.visibility}</p>
      </div>
    ))}
  </div>
);
};

export default App;