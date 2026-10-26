
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Метод не разрешён"
    });
  }

  res.setHeader(
    "Set-Cookie",
    "applux_session=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0"
  );

  return res.status(200).json({
    success: true
  });
}
