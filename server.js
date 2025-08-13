const express = require("express");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const app = express();
const upload = multer();

// 静态文件托管（让前端可以访问 index.html）
app.use(express.static("public"));

// 处理 Remove.bg API 请求
app.post("/api/remove-bg", upload.single("image"), async (req, res) => {
    const formData = new FormData();
    formData.append("image_file", req.file.buffer, { filename: req.file.originalname });
    
    try {
        const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
            headers: {
                ...formData.getHeaders(),
                "X-Api-Key": "ZEd8H3LNDPr94nBX1BWyyaHE", // 🔴 替换成你的 API Key
            },
            responseType: "arraybuffer",
        });
        res.set("Content-Type", "image/png");
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));