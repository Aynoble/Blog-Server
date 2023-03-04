import express from "express";
import { addLike, deleteLike, getLikes } from "../controllers/likes.js";

const router = express.Router();

router.post("/create", addLike);
router.get("/", getLikes);
router.delete("/:id", deleteLike);

export default router;
