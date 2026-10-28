
import { neon } from "@neondatabase/serverless";
import { isAdmin } from "./admin-session.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (!isAdmin(req)) {
    return res.status(401).json({
      error: "Требуется вход администратора"
    });
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Метод не разрешён"
    });
  }

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL не настроен");
    }

    const sql = neon(process.env.DATABASE_URL);

    const apps = await sql`
      SELECT *
      FROM apps
      ORDER BY id DESC
    `;

    return res.status(200).json(apps);
  } catch (error) {
    console.error("Admin apps error:", error);

    return res.status(500).json({
      error: "Не удалось загрузить приложения"
    });
  }
}
