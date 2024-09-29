const poppler = require('pdf-poppler');
const path = require('path');
const sharp = require('sharp');

async function convertPdfToPng(pdfPath, outputDir, resolution = 300) {
    const options = {
        format: 'png',
        out_dir: outputDir,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        page: null,  // null表示转换所有页面
        scale: resolution / 72  // 72是默认的DPI，将其提高到300 DPI
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

// 调用函数，传入PDF文件路径和输出目录路径
const pdfPath = './model.pdf';  // 替换为你的PDF文件路径
const outputDir = './';  // 替换为你想要放置PNG图片的输出目录路径
convertPdfToPng(pdfPath, outputDir, 300);
