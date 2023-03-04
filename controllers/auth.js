import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = (req, res) => {
  // CHECK IF DATA CORRESPOND WITH AN EXISTING USER.
  const q = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(q, [req.body.username, req.body.email], (err, data) => {
    if (err) res.status(500).json(err);
    if (data.length) res.status(403).json("User already exists");

    // HASH PASSWORD
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users (`username`, `email`, `password`, `fName`, `lName`) VALUES (?)";
    const values = [
      req.body.username,
      req.body.email,
      hash,
      req.body.fName,
      req.body.lName,
    ];
    db.query(q, [values], (err, data) => {
      if (err) res.status(500).json(err);

      res.status(200).json("User has been created successfully");
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) res.status(500).json(err);
    if (data.length === 0)
      res.status(404).json("User does not exist, Please create an account.");

    // COMPARE PASSWORD
    const isPassword = bcrypt.compareSync(req.body.password, data[0].password);

    if (!isPassword) res.status(401).json("incorrect password");

    const token = jwt.sign({ id: data[0].id }, process.env.jwtSEC);

    const { password, ...others } = data[0];

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out");
};
