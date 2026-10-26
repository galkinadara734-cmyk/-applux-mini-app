
import { timingSafeEqual } from "node:crypto";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Метод не разрешён"
    });
  }

  const savedPassword = process.env.ADMIN_PASSWORD;

  if (!savedPassword) {
    return res.status(503).json({
      error: "Вход администратора не настроен"
    });
  }

  const password = req.body?.password;

  if (typeof password !== "string") {
    return res.status(400).json({
      error: "Введите пароль"
    });
  }

  const a = Buffer.from(password);
  const b = Buffer.from(savedPassword);

  const valid =
    a.length === b.length &&
    timingSafeEqual(a, b);

  if (!valid) {
    return res.status(401).json({
      error: "Неверный пароль"
    });
  }

  return res.status(200).json({
    success: true
  });
}
