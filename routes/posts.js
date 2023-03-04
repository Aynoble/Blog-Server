import express from "express";
import {
  getPosts,
  getPost,
  deletePost,
  addPost,
  updatePost,
} from "../controllers/posts.js";

const router = express.Router();

router.post("/create", addPost);

router.get("/", getPosts);

router.get("/:id", getPost);

router.put("/:id", updatePost);

router.delete("/:id", deletePost);

export default router;
