import './styles.css';
import * as React from 'react';
import Cropper from 'cropperjs';
import { createRoot } from 'react-dom/client';
import { IMAGE_NAME, IMAGE_URL } from './constants';
import { SharpResult } from './SharpResult';
import { CanvasResult } from './CanvasResult';
import { Transformation } from './types';
// @ts-ignore
import * as LimbyResize from 'limby-resize/lib/canvas_resize';
import { Loader } from './Loader';
const canvasResize = LimbyResize;

const App: React.FC = () => {
    const [croppedCanvas, setCroppedCanvas] = React.useState<any>();
    const [transformation, setTransformation] = React.useState<Transformation>();
    const [loading, setLoading] = React.useState(false);
    const imageRef = React.useRef<any>();
    const cropperRef = React.useRef<any>();

    React.useEffect(() => {
        if (imageRef.current && !cropperRef.current) {
            cropperRef.current = new Cropper(imageRef.current, {
                viewMode: 1,
                autoCropArea: 1,
                aspectRatio: 4/3,
                crop: async () => {
                }
            });
        }
    }, [imageRef.current]);

    const handleImageCrop = () => {
        const resultCanvas = cropperRef.current.getCroppedCanvas();
        const transformation = cropperRef.current.getData(true);

        setCroppedCanvas(resultCanvas);
        setTransformation(transformation);
    };

    const handleImageRotate = () => {
        cropperRef.current.rotate(12);

        const resultCanvas = cropperRef.current.getCroppedCanvas();
        const transformation = cropperRef.current.getData(true);

        setCroppedCanvas(resultCanvas);
        setTransformation(transformation);
    };

    const handleImageResize = () => {
        setLoading(true);

        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = 650;
        resizedCanvas.height = 500;

        const canvasResize = (window as any).canvasResize;
        const canvas = cropperRef.current.getCroppedCanvas();
        const transformation = cropperRef.current.getData(true);

        setTransformation({
            ...transformation,
            resizeWidth: 650,
            resizeHeight: 500
        });

        canvasResize(canvas, resizedCanvas, () => {
            setCroppedCanvas(resizedCanvas);
            setLoading(false);
        });
    };

    return <div>
        <h1>CropperJS demo</h1>
        {loading && <Loader/>}

        <div className="header">
            <button onClick={handleImageCrop}>Crop</button>
            <button onClick={handleImageRotate}>Rotate</button>
            <button onClick={handleImageResize}>Resize</button>
        </div>

        <div className="cropper-wrapper">
            <img
                ref={imageRef}
                src={IMAGE_URL}
            />
        </div>

        <div className="results-wrapper">
            <CanvasResult canvasElement={croppedCanvas} />
            <SharpResult imageName={IMAGE_NAME} transformations={transformation} />
        </div>
    </div>
};

const rootElement = document.getElementById("app");
const root = createRoot(rootElement!);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
