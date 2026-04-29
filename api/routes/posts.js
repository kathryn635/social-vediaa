import express from "express";
import { getPosts, addPost, deletePost } from "../controllers/post.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const requireAuth = (req, res, next) => {
  const header = req.header("authorization") || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, "secretkey");
    req.userId = payload.id;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

router.get("/", getPosts);
router.post("/", requireAuth, addPost);
router.delete("/:id", requireAuth, deletePost);

export default router;