import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { DiaryEntry, NewDiaryEntry } from "./types";
import "./App.css";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  const [date, setDate] = useState("");
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/diaries")
      .then((response) => response.json())
      .then((data: DiaryEntry[]) => {
        setDiaries(data);
      });
  }, []);

  const submitDiary = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const newDiary: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment,
    };

    fetch("http://localhost:3000/api/diaries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDiary),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorResponse = await response.json().catch(() => null);

          let message = "Failed to create diary entry";

          if (Array.isArray(errorResponse?.error) && errorResponse.error.length > 0) {
            // Find the issue corresponding to visibility or weather if present
            const visibilityIssue = errorResponse.error.find(
              (e: { path?: string[] }) => e.path?.[0] === "visibility"
            );
            const weatherIssue = errorResponse.error.find(
              (e: { path?: string[] }) => e.path?.[0] === "weather"
            );

            // Prioritize visibility/weather to produce the "Incorrect <field>: <value>" message
            if (visibilityIssue && visibility) {
              message = `Incorrect visibility: ${visibility}`;
            } else if (weatherIssue && weather) {
              message = `Incorrect weather: ${weather}`;
            } else {
              const firstIssue = errorResponse.error[0];
              const field = firstIssue.path?.[0];
              message = field ? `Incorrect ${field}` : firstIssue.message;
            }
          } else if (typeof errorResponse?.error === "string") {
            message = errorResponse.error;
          }

          throw new Error(message);
        }

        return response.json();
      })
      .then((data: DiaryEntry) => {
        setDiaries(diaries.concat(data));

        setDate("");
        setWeather("");
        setVisibility("");
        setComment("");
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  };

  return (
    <div>
      <h1>Flight Diaries</h1>

      <h2>Add new entry</h2>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <form onSubmit={submitDiary}>
        <div>
          <label>
            date{" "}
            <input
              type="text"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            visibility{" "}
            <input
              type="text"
              value={visibility}
              onChange={(event) => setVisibility(event.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            weather{" "}
            <input
              type="text"
              value={weather}
              onChange={(event) => setWeather(event.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            comment{" "}
            <input
              type="text"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>

      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>visibility: {diary.visibility}</p>
          <p>weather: {diary.weather}</p>
        </div>
      ))}
    </div>
  );
};

export default App;