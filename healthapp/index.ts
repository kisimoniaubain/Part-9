import express from "express";
import { calculateBmi } from "./bmiCalculator.ts";
import { calculateExercises } from "./exerciseCalculator.ts";

const app = express();

const PORT = 3003;

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (
    !req.query.height ||
    !req.query.weight ||
    isNaN(height) ||
    isNaN(weight)
  ) {
    res.status(400).json({
      error: "malformatted parameters",
    });
    return;
  }

  res.json({
    weight,
    height,
    bmi: calculateBmi(height, weight),
  });
});

app.post("/exercises", (req, res) => {
  const body: unknown = req.body;

  if (typeof body !== "object" || body === null) {
    res.status(400).json({
      error: "malformatted parameters",
    });
    return;
  }

  const bodyRecord = body as Record<string, unknown>;

  const dailyExercises = bodyRecord.daily_exercises;
  const target = bodyRecord.target;

  if (
    !Array.isArray(dailyExercises) ||
    typeof target !== "number"
  ) {
    res.status(400).json({
      error: "malformatted parameters",
    });
    return;
  }

  const exercises: number[] = [];

  for (const exercise of dailyExercises) {
    if (typeof exercise !== "number") {
      res.status(400).json({
        error: "malformatted parameters",
      });
      return;
    }

    exercises.push(exercise);
  }

  const result = calculateExercises(exercises, target);

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});