import './styles.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Cropper from 'react-easy-crop'
import { CanvasResult } from './CanvasResult';
import { SharpResult } from './SharpResult';
import { IMAGE_NAME, IMAGE_URL } from './constants';

const App = () => {
    const [crop, setCrop] = React.useState({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState(1);
    const [transformation, setTransformation] = React.useState<any>();
    const [rotation, setRotation] = React.useState(0);

    const onCropComplete = React.useCallback((_: any, croppedAreaPixels: any) => {
        setTransformation({ ...croppedAreaPixels, rotation });
    }, [rotation]);

    const handleImageRotate = () => {
        setRotation(r => (r + 12) % 360);
    };

    const handleImageResize = () => {
        setTransformation((transformation: any) => ({
            ...transformation,
            resizeWidth: 650,
            resizeHeight: 500
        }));
    };

    return (
        <div>
            <h1>React Easy Crop demo</h1>

            <div className="header">
                <button id="cropButton">Crop</button>
                <button onClick={handleImageRotate}>Rotate</button>
                <button onClick={handleImageResize}>Resize</button>
            </div>

            <div className="cropper-wrapper">
                <Cropper
                    image={IMAGE_URL}
                    rotation={rotation}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>

            <div className="results-wrapper">
                <CanvasResult src={IMAGE_URL} transformation={transformation} />
                <SharpResult imageName={IMAGE_NAME} transformations={transformation} />
            </div>
        </div>
    );
};

const rootElement = document.getElementById("app");
const root = createRoot(rootElement!);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
