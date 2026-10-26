import {
  createHash,
  createHmac,
  timingSafeEqual
} from "node:crypto";

export function isAdmin(req) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  const cookies = req.headers.cookie || "";
  const session = cookies.split(";")
    .map(part => part.trim())
    .find(part => part.startsWith("applux_session="));

  if (!session) return false;

  const token = session.slice("applux_session=".length);
  const parts = token.split(".");

  if (parts.length !== 3) return false;

  const [expiresText, nonce, signature] = parts;

  if (!/^\d{13}$/.test(expiresText)) return false;
  if (!/^[a-f0-9]{32}$/.test(nonce)) return false;
  if (!/^[a-f0-9]{64}$/.test(signature)) return false;

  const expires = Number(expiresText);
  if (!Number.isSafeInteger(expires)) return false;
  if (expires <= Date.now()) return false;

  const secret = createHash("sha256")
    .update("applux-session:" + password)
    .digest();

  const expected = createHmac("sha256", secret)
    .update(`${expiresText}.${nonce}`)
    .digest();

  return timingSafeEqual(
    Buffer.from(signature, "hex"),
    expected
  );
}

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Метод не разрешён"
    });
  }

  const authenticated = isAdmin(req);

  return res.status(authenticated ? 200 : 401).json({
    authenticated
  });
}
