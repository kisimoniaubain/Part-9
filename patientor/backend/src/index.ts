import express from "express";
import cors from "cors";

const app = express();

const PORT = 3001;

app.use(cors());

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});