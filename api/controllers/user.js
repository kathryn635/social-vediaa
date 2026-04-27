import db from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
    if (!user) return res.status(404).json("User not found!");
    const { password, ...info } = user;
    return res.json(info);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "secretkey", async (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      await db.run(
        "UPDATE users SET name = ?, city = ?, website = ?, profilePic = ?, coverPic = ? WHERE id = ?",
        [
          req.body.name,
          req.body.city,
          req.body.website,
          req.body.coverPic,
          req.body.profilePic,
          userInfo.id,
        ]
      );

      return res.json("Updated!");
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};