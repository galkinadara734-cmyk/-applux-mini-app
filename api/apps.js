
import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const apps = await sql`
      SELECT * FROM apps
      WHERE is_available = true
      ORDER BY id DESC
    `;

    return res.status(200).json(apps);
  } catch (error) {
    console.error("Catalog API error:", error);
    return res.status(500).json({
      error: "Не удалось загрузить каталог"
    });
  }
}
  
