// CORS FIX FOR VERCEL -> RENDER
const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // IMPORTANT: handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});
