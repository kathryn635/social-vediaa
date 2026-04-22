import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "sql.freedb.tech",
  user: "freedb_freedb_social",
  password: "VDHJJwv7f2@hmAZ",
  database: "freedb_social",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error("Ошибка подключения к БД:", err.message);
  } else {
    console.log("Connected to database!");
  }
});