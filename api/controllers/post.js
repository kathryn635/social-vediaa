import db from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = async (req, res) => {
  try {
    const userId = req.query.userId;
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      let posts;
      if (userId !== "undefined") {
        posts = await db.all(
          `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`,
          [userId]
        );
      } else {
        posts = await db.all(
          `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
          LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ?
          ORDER BY p.createdAt DESC`,
          [userInfo.id, userInfo.id]
        );
      }
      return res.status(200).json(posts);
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const addPost = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      await db.run(
        "INSERT INTO posts (`desc`, img, createdAt, userId) VALUES (?, ?, ?, ?)",
        [req.body.desc, req.body.img, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), userInfo.id]
      );
      return res.status(200).json("Post has been created.");
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      const result = await db.run(
        "DELETE FROM posts WHERE id = ? AND userId = ?",
        [req.params.id, userInfo.id]
      );
      if (result.changes > 0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};