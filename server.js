const express = require("express");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const cors = require("cors"); // 新增：解决跨域问题
const app = express();
const upload = multer();

// 启用 CORS（允许前端跨域访问）
app.use(cors());

// 静态文件托管
app.use(express.static("public"));

// 测试 GET 请求（可选）
app.get("/api/remove-bg", (req, res) => {
  res.status(200).json({ message: "请使用 POST 方法上传图片" });
});

// 处理 POST 请求（实际抠图逻辑）
app.post("/api/remove-bg", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "未上传图片" });
  }

  const formData = new FormData();
  formData.append("image_file", req.file.buffer, { filename: req.file.originalname });

  try {
    const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
      headers: {
        ...formData.getHeaders(),
        "X-Api-Key": process.env.REMOVE_BG_API_KEY || "你的API_KEY", // 从环境变量读取
      },
      responseType: "arraybuffer",
    });
    res.set("Content-Type", "image/png");
    res.send(response.data);
  } catch (error) {
    console.error("Remove.bg API 错误:", error.message);
    res.status(500).json({ error: "抠图失败，请检查API额度或网络" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`服务运行中: http://localhost:${PORT}`));