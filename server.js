import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.dbSEC,
  database: "blog",
});

const app = express();

app.get("/", (req, res) => {
  connection.query("SELECT * FROM your-table", (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

export default app;
