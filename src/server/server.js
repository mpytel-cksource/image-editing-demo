const express = require('express');
const cors = require('cors');
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('path');
const app = express();
const PORT = 8000;
const ASSETS_PATH = path.join(process.cwd(), 'assets');

app.use(express.json());
app.use(cors());

app.post('/image/:imageName', async (req, res) => {
    const transformations = req.body;
    const imageName = req.params.imageName;
    const filePath = path.join(ASSETS_PATH, imageName);

    const fileBuffer = await fs.readFile(filePath);
    const processedFile = await _processBySharp(fileBuffer, transformations);

    res.set('Content-Type', 'image/jpeg');
    res.status(200).send(processedFile);
});

app.listen(PORT, () => {
    console.log('Sample server listening on: ', PORT);
});

const _processBySharp = (inputImage, transformations) => {
    const sharpInstance = sharp(inputImage);
    const { x, y, rotate, width, height, scaleX, scaleY, resizeWidth, resizeHeight } = transformations;

    // Apply rotation
    if (rotate) {
        sharpInstance.rotate(rotate);
    }

    // Apply crop
    if (Number.isInteger(x) && Number.isInteger(y) && Number.isInteger(width) && Number.isInteger(height)) {
        sharpInstance.extract({
            width,
            height,
            left: x,
            top: y
        });
    }

    if (resizeWidth && resizeHeight) {
        sharpInstance.resize(resizeWidth, resizeHeight);
    }

    return sharpInstance
        .jpeg()
        .toBuffer();
};
