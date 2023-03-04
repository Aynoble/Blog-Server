import { db } from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const addComment = (req, res) => {
  const q = "INSERT INTO comments (`desc`, `uid`, `postid`, `date`) VALUES (?)";
  const values = [req.body.desc, req.body.uid, req.body.postid, req.body.date];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json("Comment added successfully");
  });
};

export const getComments = (req, res) => {
  const postID = req.query._id;
  const q =
    "SELECT `username`, `img`, `desc`, `date`, c.id AS commentId FROM comments c join users u ON  c.uid = u.id WHERE c.postid = ?";

  db.query(q, [postID], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const updateComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("You're not authenticated");

  jwt.verify(token, process.env.jwtSEC, (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    const q = "UPDATE comments SET `desc` = ? WHERE id = ? and uid = ?";

    db.query(q, [req.body.desc, req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("You've updated comment successfully");
    });
  });
};

export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("You're not authenticated");

  jwt.verify(token, process.env.jwtSEC, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");

    const q = "DELETE FROM comments WHERE id = ? AND uid = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Comment deleted successfully");
    });
  });
};
