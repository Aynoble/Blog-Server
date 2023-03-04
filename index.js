import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import postRoute from "./routes/posts.js";
import cookieParser from "cookie-parser";
import Cors from "cors";
import multer from "multer";
import userRoute from "./routes/users.js";
import commentRoute from "./routes/comments.js";
import likeRoute from "./routes/likes.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(Cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/profilePic");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

const profilePicUpload = multer({ storage: uploadStorage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.post(
  "/api/profileUpload",
  profilePicUpload.single("profilePic"),
  function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename);
  }
);

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/likes", likeRoute);

app.listen(process.env.PORT || 8800, () => {
  console.log("server is running");
});
