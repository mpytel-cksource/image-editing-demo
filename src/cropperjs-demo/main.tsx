// @ts-nocheck
import Cropper from "cropperjs";
import axios from 'axios';
import * as LimbyResize from 'limby-resize/lib/canvas_resize';
const canvasResize = LimbyResize;
const IMAGE_EDITING_URL: string = 'http://localhost:8000/image';
import './styles.css';

(() => {
    const image = document.getElementById("image");
    const cropper = new Cropper(image as any, {
        viewMode: 1,
        aspectRatio: 16 / 9,
        crop: async (event) => {
            console.log('E: ', event);
        }
    });

    const cropButton = document.getElementById('cropButton');
    const rotateButton = document.getElementById('rotateButton');
    const resizeButton = document.getElementById('resizeButton');

    cropButton.addEventListener('click', () => {
        const cropperData = cropper.getData(true);

        _displayResultImage(cropperData);
        _displayResultImageInCanvas(cropper.getCroppedCanvas());
    });

    rotateButton.addEventListener('click', () => {
        cropper.rotate(12);

        const cropperData = cropper.getData(true);

        _displayResultImage(cropperData);
        _displayResultImageInCanvas(cropper.getCroppedCanvas());
    });

    resizeButton.addEventListener('click', () => {
        const cropperData = cropper.getData(true);

        _displayResultImage({
            ...cropperData,
            rWidth: 850,
            rHeight: 500
        });

        _displayResizedResultImageInCanvas(cropper.getCroppedCanvas());
    });
})();

interface ImageTransformations {
    height: number,
    rotate: number,
    scaleX: number,
    scaleY: number,
    width: number,
    x: number,
    y: number
}

/**
 * Send CropperJS result transformation object to Express server, and
 * display resulted image in a separate container.
 * @param {CropperJS} cropperData
 * @private
 */
const _displayResultImage = async (cropperData) => {
    const response = await sendTransformationsToServer(cropperData as ImageTransformations);
    const parent = document.querySelector('#sharp-result');
    const image = new Image();

    const imageBuffer = response.data;
    const arrayBufferView = new Uint8Array( imageBuffer );
    const blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL( blob );

    image.src = imageUrl;
    image.style.width = '100%';
    image.style.height = '100%';
    image.style.objectFit = 'contain';

    parent.innerHTML = '';
    parent.appendChild(image);
};

/**
 * Gets cropped canvas from CropperJS instance, and display result as an image
 * in a separate container.
 * @param {CropperJS} canvas Cropped canvas
 * @private
 */
const _displayResultImageInCanvas = (canvas) => {
    const parent = document.querySelector('#canvas-result');
    const img = canvas.toDataURL('image/jpeg');
    const image = new Image();
    image.src = img;
    image.style.width = '100%';
    image.style.height = '100%';
    image.style.objectFit = 'contain';

    parent.innerHTML = '';
    parent.appendChild(image);
};

/**
 * Gets original canvas from CropperJS instance, crops it via external lib (Limby resize), and
 * displays its result as an image in a separate container.
 * @param canvas Original canvas
 * @private
 */
const _displayResizedResultImageInCanvas = (canvas) => {
    const parent = document.querySelector('#canvas-result');
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = 850;
    resizedCanvas.height = 500;

    const canvasResize = window.canvasResize;
    canvasResize(canvas, resizedCanvas, () => {
        const img = resizedCanvas.toDataURL('image/jpeg');
        const image = new Image();
        image.src = img;
        image.style.width = '100%';
        image.style.height = '100%';
        image.style.objectFit = 'contain';

        parent.innerHTML = '';
        parent.appendChild(image);
    });
};

/**
 * Sends CropperJS transformations object to Express server, where it will be later
 * processed by Sharp.
 * @param transformations
 */
const sendTransformationsToServer = async (transformations: ImageTransformations) => {
  return axios.post(
      IMAGE_EDITING_URL,
      transformations, {
          responseType: 'arraybuffer'
      }
  );
};
