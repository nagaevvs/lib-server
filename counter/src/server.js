const express = require("express");
const redis = require("redis");
const app = express();

const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost";

const client = redis.createClient({ url: REDIS_URL });

(async () => {
  await client.connect();
})();

app.get("/counter/:bookId/incr", async (req, res) => {
  const { bookId } = req.params;

  try {
    const cnt = await client.incr(bookId);
    res.json({ count: cnt });
  } catch (e) {
    res.statusCode(500).json({ errmsg: "Redis error!:" });
  }
});

app.get("/counter/:bookId", async (req, res) => {
  const { bookId } = req.params;

  try {
    const cnt = await client.get(bookId);
    res.json({ count: cnt });
  } catch (e) {
    res.statusCode(500).json({ errmsg: "Redis error!:" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
