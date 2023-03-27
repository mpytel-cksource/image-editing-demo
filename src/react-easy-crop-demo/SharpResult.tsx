import * as React from 'react';
import { Transformation } from './types';
import axios from 'axios';
const IMAGE_EDITING_URL: string = 'http://localhost:8000/image/';

export const SharpResult: React.FC<Props> = ({
    imageName,
    transformations
}) => {
    const [imageSrc, setImageSrc] = React.useState();

    React.useEffect(() => {
        if (!transformations || !transformations.width || !transformations.height) {
            return;
        }

        _sendTransformationsToServer(imageName, {
            ...transformations,
            // @ts-ignore
            rotate: transformations?.rotation
        })
            .then(async result => {
                const image = await _getCroppedImage(result.data);

                setImageSrc(image);
            });
    }, [transformations]);

    return <div className="result">
        <label>Sharp output</label>
        <div>
            <img className="result-image" src={imageSrc} />
        </div>
    </div>
};

interface Props {
    imageName: string,
    transformations: Transformation
}

/**
 * Sends CropperJS transformations object to Express server, where it will be later
 * processed by Sharp.
 * @param transformations
 */
const _sendTransformationsToServer = async (imageName: string, transformations: Transformation) => {
    console.log('Sharp: ', transformations);
    return axios.post(
        `${IMAGE_EDITING_URL}${imageName}`,
        transformations, {
            responseType: 'arraybuffer'
        }
    );
};

const _getCroppedImage = (imageBuffer: ArrayBuffer) => {
    return new Promise<any>((resolve) => {
        const arrayBufferView = new Uint8Array( imageBuffer );
        const blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL( blob );

        resolve(imageUrl);
    });
};
