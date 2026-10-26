
import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual
} from "node:crypto";

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

  const entered = createHash("sha256")
    .update(password)
    .digest();

  const expected = createHash("sha256")
    .update(savedPassword)
    .digest();

  if (!timingSafeEqual(entered, expected)) {
    return res.status(401).json({
      error: "Неверный пароль"
    });
  }

  const expires = Date.now() + 60 * 60 * 1000;
  const nonce = randomBytes(16).toString("hex");
  const payload = `${expires}.${nonce}`;

  const signature = createHmac(
    "sha256",
    createHash("sha256")
      .update("applux-session:" + savedPassword)
      .digest()
  )
    .update(payload)
    .digest("hex");

  const token = `${payload}.${signature}`;

  res.setHeader(
    "Set-Cookie",
    `applux_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=3600`
  );

  return res.status(200).json({
    success: true
  });
}

