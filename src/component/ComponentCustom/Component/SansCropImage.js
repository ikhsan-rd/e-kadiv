// SansCropImage.jsx
import React, { useState, useEffect } from 'react';

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', () => reject(new Error('Failed to load image')));
        image.src = url;
    });

const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
        image,
        croppedAreaPixels.x * scaleX,
        croppedAreaPixels.y * scaleY,
        croppedAreaPixels.width * scaleX,
        croppedAreaPixels.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg');
    });
};

const SansCropImage = ({ imageSrc, croppedAreaPixels, onImageCropped }) => {
    const [croppedImage, setCroppedImage] = useState(null);

    useEffect(() => {
        if (imageSrc && croppedAreaPixels) {
            const cropImage = async () => {
                const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
                setCroppedImage(URL.createObjectURL(blob));
                if (onImageCropped) onImageCropped(blob);
            };
            cropImage();
        }
    }, [imageSrc, croppedAreaPixels, onImageCropped]);

    return (
        <div>
            {croppedImage ? (
                <img src={croppedImage} alt="Cropped" />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default SansCropImage;
