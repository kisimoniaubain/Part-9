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

  useEffect(() => {
    fetch("http://localhost:3000/api/diaries")
      .then((response) => response.json())
      .then((data: DiaryEntry[]) => {
        setDiaries(data);
      });
  }, []);

  const submitDiary = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      .then((response) => response.json())
      .then((data: DiaryEntry) => {
        setDiaries(diaries.concat(data));

        setDate("");
        setWeather("");
        setVisibility("");
        setComment("");
      });
  };

  return (
    <div>
      <h1>Flight Diaries</h1>

      <h2>Add new entry</h2>

      <form onSubmit={submitDiary}>
        <div>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Weather:
            <input
              value={weather}
              onChange={(event) => setWeather(event.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Visibility:
            <input
              value={visibility}
              onChange={(event) => setVisibility(event.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Comment:
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
        </div>

        <button type="submit">Add diary</button>
      </form>

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