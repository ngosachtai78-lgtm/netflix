import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // phục vụ file tĩnh

// ✅ Route chính → load index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Route xử lý form check email
app.post("/check", async (req, res) => {
  const { email } = req.body;
  try {
    const response = await axios.post(
      "https://vivarocky.in",
      new URLSearchParams({ recipient_email: email }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.send(`
      <html>
        <head>
          <title>Kết quả</title>
          <style>
            body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:20px; }
            .content { background:white; padding:20px; border-radius:10px;
                       box-shadow:0 2px 8px rgba(0,0,0,0.2); max-width:800px; margin:auto; }
            .back-btn { display:inline-block; margin-top:20px; padding:10px 20px;
                        background:#28a745; color:white; text-decoration:none; border-radius:5px; }
            .back-btn:hover { background:#218838; }
          </style>
        </head>
        <body>
          <div class="content">
            ${response.data}
            <a href="/" class="back-btn">⬅ Quay lại</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.send("⚠️ Không thể lấy dữ liệu. Có thể vivarocky.in đang lỗi.");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
