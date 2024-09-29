const poppler = require('pdf-poppler');
const path = require('path');
const sharp = require('sharp');
const express = require('express');
const app = express();
const port = 3000;

async function convertPdfToPng(pdfPath, outputDir, resolution = 300) {
    
    const options = {
        format: 'png',
        out_dir: outputDir,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        page: null,  // null表示转换所有页面
        scale: resolution
    };

    try {
        const pdfBuffer = await poppler.convert(pdfPath, options);
        for (let i = 0; i < pdfBuffer.length; i++) {
            const inputPath = pdfBuffer[i].path;
            const outputPath = path.join(outputDir, `page-${i + 1}.png`);
            await sharp(inputPath).toFile(outputPath);
            console.log(`Page ${i + 1} successfully converted to ${outputPath} with ${resolution} DPI resolution`);
        }
    } catch (err) {
        console.error("Error converting PDF to PNG:", err);
    }
}

// 解析JSON请求体
app.use(express.json());

// 定义API路由
app.post('/convert', async (req, res) => {
    try {
        const { pdfPath } = req.body;
        if (!pdfPath) {
            return res.status(400).send('pdfPath is required');
        }

        const result = await convertPdfToPng(pdfPath);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
