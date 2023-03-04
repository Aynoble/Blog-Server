import { db } from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getUser = (req, res) => {
  const id = req.query.id;
  const q = "SELECT * FROM users WHERE id = ?";

  db.query(q, [id], (err, data) => {
    if (err) return res.status(500).json(err);

    const { password, ...others } = data[0];

    res.status(200).json([others]);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).status("You're not authenticated");

  jwt.verify(token, process.env.jwtSEC, (err, userInfo) => {
    if (err) return res.status(403).json("Your token is invalid");

    const id = req.params.id;

    const q =
      "UPDATE users SET `fName` = ?,  `lName` = ?, `username` = ?, `email` = ?, `about` = ?, `location` = ? WHERE id = ? AND id = ?";

    const values = [
      req.body.fName,
      req.body.lName,
      req.body.username,
      req.body.email,
      req.body.about,
      req.body.location,
    ];

    db.query(q, [...values, id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const updateUserImg = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).status("You're not authenticated");

  jwt.verify(token, process.env.jwtSEC, (err, userInfo) => {
    if (err) return res.status(403).json("Your token is invalid");

    const id = req.params.id;
    const theImg = req.body.img;

    const q = "UPDATE users SET `img` = ? WHERE id = ? AND id = ?";

    db.query(q, [theImg, id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Profile Picture updated successfully");
    });
  });
};
