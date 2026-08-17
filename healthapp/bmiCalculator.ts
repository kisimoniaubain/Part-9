export const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  if (bmi < 18.5) {
    return "Underweight";
  }

  if (bmi < 25) {
    return "Normal range";
  }

  if (bmi < 30) {
    return "Overweight";
  }

  return "Obese";
};

if (process.argv[1] === import.meta.filename) {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    throw new Error("Please provide height and weight");
  }

  const height = Number(args[0]);
  const weight = Number(args[1]);

  if (isNaN(height) || isNaN(weight)) {
    throw new Error("Height and weight must be numbers");
  }

  console.log(calculateBmi(height, weight));
}