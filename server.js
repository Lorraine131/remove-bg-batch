const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const path = require('path'); // 新增：用于处理文件路径
const app = express();
const upload = multer();

// 中间件设置
app.use(express.static('public')); // 托管静态文件
app.use(express.json()); // 解析JSON请求体

// 1. 基础路由 - 无需修改
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. 新增贺卡页面路由
app.get('/card', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'card.html'));
});

// 3. 抠图API（保持不变）
app.post('/api/remove-bg', upload.single('image'), async (req, res) => {
    const formData = new FormData();
    formData.append('image_file', req.file.buffer, {
        filename: req.file.originalname
    });

    try {
        const response = await axios.post(
            'https://api.remove.bg/v1.0/removebg',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'X-Api-Key': process.env.REMOVE_BG_API_KEY || '你的API密钥'
                },
                responseType: 'arraybuffer'
            }
        );
        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error('Remove.bg API error:', error.message);
        res.status(500).json({
            error: 'Background removal failed',
            details: error.response?.data?.errors?.[0]?.title || error.message
        });
    }
});

// 4. 新增AI贺卡API
app.post('/api/generate-card', upload.array('images'), async (req, res) => {
    try {
        // 这里可以调用AI服务生成贺卡
        // 示例：简单拼接图片（实际项目应该用Canvas或AI服务）
        const cardData = {
            message: "贺卡生成成功",
            previewUrl: "/sample-card.jpg" // 示例URL
        };
        res.json(cardData);
    } catch (error) {
        res.status(500).json({ error: '贺卡生成失败' });
    }
});

// 5. 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});