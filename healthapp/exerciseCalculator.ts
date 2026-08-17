export interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyExercises: number[],
  target: number
): ExerciseResult => {
  const periodLength = dailyExercises.length;

  const trainingDays = dailyExercises.filter(
    (hours) => hours > 0
  ).length;

  const totalHours = dailyExercises.reduce(
    (sum, hours) => sum + hours,
    0
  );

  const average = totalHours / periodLength;

  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average < target * 0.5) {
    rating = 1;
    ratingDescription = "bad";
  } else if (average < target) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 3;
    ratingDescription = "good";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (process.argv[1] === import.meta.filename) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    throw new Error("Please provide target and exercise hours");
  }

  const target = Number(args[0]);
  const dailyExercises = args.slice(1).map(Number);

  if (
    isNaN(target) ||
    dailyExercises.some((exercise: number) => isNaN(exercise))
  ) {
    throw new Error("Arguments must be numbers");
  }

  console.log(calculateExercises(dailyExercises, target));
}