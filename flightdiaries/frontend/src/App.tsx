import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { DiaryEntry, NewDiaryEntry } from "./types";
import "./App.css";

const weatherOptions = [
  "sunny",
  "rainy",
  "cloudy",
  "stormy",
  "windy",
] as const;

const visibilityOptions = [
  "great",
  "good",
  "ok",
  "poor",
] as const;

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

          if (
            Array.isArray(errorResponse?.error) &&
            errorResponse.error.length > 0
          ) {
            const firstIssue = errorResponse.error[0];

            const field = firstIssue.path?.[0];

            if (field) {
              message = `Incorrect ${field}`;
            } else if (firstIssue.message) {
              message = firstIssue.message;
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

      {error && (
        <div style={{ color: "red" }}>
          Error: {error}
        </div>
      )}

      <form onSubmit={submitDiary}>
        <div>
          <label>
            date{" "}
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
        </div>

        <div>
          visibility{" "}
          {visibilityOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={visibility === option}
                onChange={(event) =>
                  setVisibility(event.target.value)
                }
              />
              {option}
            </label>
          ))}
        </div>

        <div>
          weather{" "}
          {weatherOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="weather"
                value={option}
                checked={weather === option}
                onChange={(event) =>
                  setWeather(event.target.value)
                }
              />
              {option}
            </label>
          ))}
        </div>

        <div>
          <label>
            comment{" "}
            <input
              type="text"
              value={comment}
              onChange={(event) =>
                setComment(event.target.value)
              }
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