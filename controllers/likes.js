import { db } from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const addLike = (req, res) => {
  const q = "INSERT INTO likes (`postid`, `uid`) VALUES (?)";
  const values = [req.body.postid, req.body.uid];
  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Like added successfully");
  });
};

export const getLikes = (req, res) => {
  const q = "SELECT * FROM likes WHERE postid = ?";

  db.query(q, req.query.id, (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("You're not authenticated");

  jwt.verify(token, process.env.jwtSEC, (err, userInfo) => {
    if (err) return res.status(403).json("Your token is invalid");

    const q = "DELETE FROM likes WHERE id = ? AND uid = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Like Successfully Deleted");
    });
  });
};
