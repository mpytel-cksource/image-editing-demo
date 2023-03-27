import * as React from 'react';
import { Transformation } from './types';

export const CroppedCanvas: React.FC<Props> = ({
    src,
    transformation
}) => {
    if (!transformation) {
        return null;
    }

    const [imageSrc, setImageSrc] = React.useState<any>();

    React.useEffect(() => {
        console.log('Cropped canvas: ', transformation);
        _getCroppedImage(src, transformation)
            .then(result => setImageSrc(result));
    }, [transformation, setImageSrc]);

    return <div className="result">
        <label>Cropped canvas</label>
        <div>
            <img className="result-image" src={imageSrc} />
        </div>
    </div>
};

interface Props {
    transformation: Transformation,
    src: string
}

const _getRadianAngle = (degreeValue: number) => {
    return (degreeValue * Math.PI) / 180
};

const _rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = _getRadianAngle(rotation);

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    }
};

const _getCroppedImage = async (imageSrc: string, transformation: Transformation) => {
    const { x, y, width, height, rotation } = transformation;
    const _getImage = () => {
        return new Promise<any>((resolve) => {
            const image = new Image();
            image.onload = () => {
                resolve(image);
            };
            image.src = imageSrc;
        });
    };

    const image = await _getImage();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const rotRad = _getRadianAngle(rotation);
    const { width: bBoxWidth, height: bBoxHeight } = _rotateSize(
        image.width,
        image.height,
        rotation
    );

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx!.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx!.rotate(rotRad);
    ctx!.scale(1, 1);
    ctx!.translate(-image.width / 2, -image.height / 2);

    ctx!.drawImage(image, 0, 0 );

    const data = ctx!.getImageData(
        x,
        y,
        width,
        height
    );

    canvas.width = width;
    canvas.height = height;

    ctx!.putImageData(data, 0, 0);

    return new Promise((resolve) => {
        canvas.toBlob((file: any) => {
            resolve(URL.createObjectURL(file))
        }, 'image/jpeg')
    });
};
