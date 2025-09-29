import express from "express";

import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

console.log("mysql url:", sql);

const PORT = process.env.PORT;

const app = express();

console.log("my port is", PORT);

console.log("my database url is", process.env.DATABASE_URL);
app.get("/", (req, res) => {
  res.send("Server is up and running");
});

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions ( 
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title  VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
  )`;

    console.log("Table created successfully");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

app.use(express.json());

app.post("/api/transactions", async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;
    if (!user_id || !title || !amount || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const transaction =
      await sql`INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) 
        
        RETURNING *`;
    console.log("Transaction added:", transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId}`;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("error getting transaction", error);
    res.status(500).json({ message: "internal server error" });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const id = req.params;

    const result =
      await sql` DELETE FROM TRANSACTIONS WHERRE id = {id} RETURNING *`;

    if (req.params === 0) {
      res.status(200).json({ message: "transaction successfully deleted" });
    }
  } catch (error) {}
});

app.get("/api/transactions/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    if (isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}`;

    const incomeResult =
      await sql`SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id =${userId} AND amount > 0`;

    const expenseResult =
      await sql`SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id =${userId} AND amount < 0`;

    const summary = {
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    };

    res.status(200).json(summary);
    console.log(summary);
  } catch (error) {
    console.log("error getting summary", error);
    res.status(500).json({ message: "internal server error" });
  }
});
