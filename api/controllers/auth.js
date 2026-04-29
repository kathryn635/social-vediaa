import db from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json("All fields are required!");
    }

    // Проверяем, существует ли пользователь
    const existingUser = await db.get(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (existingUser) return res.status(409).json("User already exists!");

    // Хешируем пароль
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Добавляем пользователя
    const result = await db.run(
      "INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, name || username]
    );

    const user = await db.get("SELECT * FROM users WHERE id = ?", [result.lastID]);
    const token = jwt.sign({ id: user.id }, "secretkey");
    const { password: _, ...others } = user;

    res
      .cookie("accessToken", token, { httpOnly: false, secure: false, sameSite: "lax" })
      .status(200)
      .json(others);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json("All fields are required!");
    }

    const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
    if (!user) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: user.id }, "secretkey");
    const { password: _, ...others } = user;

    res
      .cookie("accessToken", token, { httpOnly: false, secure: false, sameSite: "lax" })
      .status(200)
      .json(others);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: false,
      sameSite: "lax",
    })
    .status(200)
    .json("User has been logged out.");
};