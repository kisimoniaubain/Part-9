interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  dailyExerciseHours: number[],
  target: number
): Result => {
  const periodLength = dailyExerciseHours.length;

  const trainingDays = dailyExerciseHours.filter(
    (hours) => hours > 0
  ).length;

  const totalHours = dailyExerciseHours.reduce(
    (sum, hours) => sum + hours,
    0
  );

  const average = totalHours / periodLength;

  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "very good";
  } else if (average >= target * 0.5) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "could be better";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

const args = process.argv.slice(2);

if (args.length < 2) {
  throw new Error(
    "Please provide a target and at least one exercise hour."
  );
}

const numbers: number[] = args.map(
  (argument: string): number => Number(argument)
);

if (numbers.some((number: number): boolean => isNaN(number))) {
  throw new Error("All arguments must be numbers.");
}

const target = numbers[0];
const dailyExerciseHours = numbers.slice(1);

console.log(calculateExercises(dailyExerciseHours, target));

export {};