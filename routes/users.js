import express from "express";
import { getUser, updateUser, updateUserImg } from "../controllers/users.js";

const router = express.Router();

router.get("/", getUser);
router.put("/:id", updateUser);
router.put("/img/:id", updateUserImg);

export default router;
