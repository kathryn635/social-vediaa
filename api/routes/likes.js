import express from "express";
import { getLikes, addLike, deleteLike } from "../controllers/like.js";
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

router.get("/", getLikes);
router.post("/", requireAuth, addLike);
router.delete("/", requireAuth, deleteLike);

export default router;