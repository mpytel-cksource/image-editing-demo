import * as React from 'react';

export const CanvasResult: React.FC<Props> = ({
    canvasElement
}) => {
    const [imageSrc, setImageSrc] = React.useState<any>();

    React.useEffect(() => {
        if (!canvasElement) {
            return;
        }

        setImageSrc(_getImage(canvasElement));
    }, [canvasElement]);

    if (!canvasElement) {
        return null;
    }

    return <div className="result">
        <label>Canvas output</label>
        <div>
            <img className="result-image" src={imageSrc} />
        </div>
    </div>
};

interface Props {
    canvasElement: HTMLCanvasElement
}

/**
 * Returns a data URL containing a representation of the image.
 * @param canvas
 * @private
 */
const _getImage = (canvas: HTMLCanvasElement) => {
    const img = canvas.toDataURL('image/jpeg');

    return img;
};
