import express from "express";

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});

console.log("my port is", PORT);

console.log("my database url is", process.env.DATABASE_URL);
app.get("/", (req, res) => {
  res.send("Server is up and running");
});
