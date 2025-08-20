import React,{ useState,useCallback,useEffect } from 'react';
import { Modal,Button } from 'react-bootstrap';
import Cropper from 'react-easy-crop';

// Function to create an image object from a URL
const createImage = (url) =>
    new Promise((resolve,reject) =>
    {
        const image = new Image();
        image.addEventListener('load',() => resolve(image));
        image.addEventListener('error',() => reject(new Error('Failed to load image')));
        image.src = url;
    });

// Function to get a cropped image as a blob
const getCroppedImg = async (imageSrc,croppedAreaPixels) =>
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

const SansCropImage = ({
    imageSrc,
    show,
    onHide,
    onCropComplete,
    onCancel,
    style,
    rasio = 1
}) =>
{
    const [crop,setCrop] = useState({ x: 0,y: 0 });
    const [zoom,setZoom] = useState(1);
    const [croppedArea,setCroppedArea] = useState(null);

    // Handle crop completion and send the cropped image to parent
    const handleCropComplete = useCallback(async () =>
    {
        if (croppedArea)
        {
            const croppedBlob = await getCroppedImg(imageSrc,croppedArea);
            if (onCropComplete) onCropComplete(croppedBlob);
        }
    },[croppedArea,imageSrc,onCropComplete]);

    useEffect(() =>
    {
        if (show)
        {
            setCrop({ x: 0,y: 0 });
            setZoom(1);
            setCroppedArea(null);
        }
    },[show]);

    return (
        <Modal
            show={show}
            onHide={() =>
            {
                onHide();
                if (onCancel) onCancel();
            }}
            centered
            style={style}
        >
            <Modal.Header closeButton>
                <Modal.Title>Crop Foto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ position: 'relative',width: '100%',height: '400px' }}>
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={rasio}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={(croppedAreaPercentage,croppedAreaPixels) =>
                                setCroppedArea(croppedAreaPixels)
                            }
                        />
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() =>
                {
                    onHide();
                    if (onCancel) onCancel();
                }}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleCropComplete}>
                    Crop
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SansCropImage;
