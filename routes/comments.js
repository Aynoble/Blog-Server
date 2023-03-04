import express from "express";
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comments.js";

const router = express.Router();

router.post("/create", addComment);
router.get("/", getComments);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
