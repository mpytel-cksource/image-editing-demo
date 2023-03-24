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

app.post('/image', async (req, res) => {
    const transformations = req.body;
    const filePath = path.join(ASSETS_PATH, 'image_24MP.jpeg');

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
    const { x, y, rotate, width, height, scaleX, scaleY, rWidth, rHeight } = transformations;

    // Apply rotation
    if (rotate) {
        sharpInstance.rotate(rotate);
    }

    // Apply crop
    if (x && y && width && height) {
        sharpInstance.extract({
            width,
            height,
            left: x,
            top: y
        });
    }

    if (rWidth && rHeight) {
        sharpInstance.resize(rWidth, rHeight);
    }

    return sharpInstance
        .jpeg()
        .toBuffer();
};
