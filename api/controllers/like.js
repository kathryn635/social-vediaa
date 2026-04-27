import db from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = async (req, res) => {
  try {
    const data = await db.all(
      "SELECT userId FROM likes WHERE postId = ?",
      [req.query.postId]
    );
    return res.status(200).json(data.map(like => like.userId));
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const addLike = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      await db.run(
        "INSERT INTO likes (userId, postId) VALUES (?, ?)",
        [userInfo.id, req.body.postId]
      );
      return res.status(200).json("Post has been liked.");
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const deleteLike = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      await db.run(
        "DELETE FROM likes WHERE userId = ? AND postId = ?",
        [userInfo.id, req.query.postId]
      );
      return res.status(200).json("Post has been disliked.");
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};