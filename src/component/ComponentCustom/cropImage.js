const createImage = (url) =>
    new Promise((resolve,reject) =>
    {
        const image = new Image();
        image.addEventListener('load',() => resolve(image));
        image.addEventListener('error',() => reject(new Error('Failed to load image')));
        image.src = url;
    });

export const getCroppedImg = async (imageSrc,croppedAreaPixels) =>
{
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

    return new Promise((resolve) =>
    {
        canvas.toBlob((blob) =>
        {
            resolve(blob);
        },'image/jpeg');
    });
};

export default getCroppedImg;
