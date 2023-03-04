import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
db.connect((err) => {
  if (err) {
    return console.log("db not connected " + err);
  } else {
    return console.log("db connection successfull");
  }
});
