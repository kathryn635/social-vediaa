import db from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = async (req, res) => {
  try {
    const data = await db.all(
      "SELECT followerUserId FROM relationships WHERE followedUserId = ?",
      [req.query.followedUserId]
    );
    return res.status(200).json(data.map(relationship => relationship.followerUserId));
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const addRelationship = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      await db.run(
        "INSERT INTO relationships (followerUserId, followedUserId) VALUES (?, ?)",
        [userInfo.id, req.body.userId]
      );
      return res.status(200).json("Following");
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const deleteRelationship = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      await db.run(
        "DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?",
        [userInfo.id, req.query.userId]
      );
      return res.status(200).json("Unfollow");
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};