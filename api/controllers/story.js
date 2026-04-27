import db from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getStories = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      const stories = await db.all(
        `SELECT s.*, name FROM stories AS s JOIN users AS u ON (u.id = s.userId)
        LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId = ?) LIMIT 4`,
        [userInfo.id]
      );
      return res.status(200).json(stories);
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const addStory = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      await db.run(
        "INSERT INTO stories (img, createdAt, userId) VALUES (?, ?, ?)",
        [req.body.img, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), userInfo.id]
      );
      return res.status(200).json("Story has been created.");
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const deleteStory = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      const result = await db.run(
        "DELETE FROM stories WHERE id = ? AND userId = ?",
        [req.params.id, userInfo.id]
      );
      if (result.changes > 0)
        return res.status(200).json("Story has been deleted.");
      return res.status(403).json("You can delete only your story!");
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};