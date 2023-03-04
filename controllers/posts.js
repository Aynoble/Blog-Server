import { db } from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getPosts = (req, res) => {
  const q =
    req.query.cat || req.query.id
      ? "SELECT * FROM posts WHERE cat = ? OR uid = ?"
      : "SELECT * FROM posts";

  db.query(q, [req.query.cat, req.query.id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};

export const getPost = (req, res) => {
  const q =
    "SELECT  `username`, p.id, `title`, `desc`, `postImg`, `img`, `cat`, `date`, `uid` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("You're not authenticated");

  jwt.verify(token, process.env.jwtSEC, (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token");
    const q =
      "INSERT INTO posts (`title`, `desc`, `postImg`, `cat`, `date`, `uid` ) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.postImg,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Successfully Created Post");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("You're not authenticated");
  jwt.verify(token, process.env.jwtSEC, (err, userInfo) => {
    if (err) return res.status(403).json("invalid token");
    const postId = req.params.id;
    const q =
      "UPDATE posts SET `title`= ?, `desc` = ?, `postImg` = ?, `cat` = ? WHERE `id` = ? AND `uid` = ?";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.postImg,
      req.body.cat,
    ];

    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Successfully Updated Post");
    });
  });
};
export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("You're not authenticated");

  jwt.verify(token, process.env.jwtSEC, (err, userInfo) => {
    if (err) return res.status(403).json("invalid token");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE id = ? AND uid = ?";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err)
        return res.status(403).json("You're not allowed to delete this post");

      return res.status(200).json("Post deleted successfully");
    });
  });
};
