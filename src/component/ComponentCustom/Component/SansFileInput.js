import React,{ useEffect,useState } from 'react';
import { Modal,Button,Image } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

function SansFileInput({
    show,
    onHide,
    fileSrc,
    onDelete,
    buttonDelete = true,
    title = 'KTM/SIA'
})
{
    const [fileUrl,setFileUrl] = useState(null);
    const [isPdf,setIsPdf] = useState(false);

    useEffect(() =>
    {
        if (fileSrc)
        {
            if (fileSrc instanceof File)
            {
                const objectUrl = URL.createObjectURL(fileSrc);
                setFileUrl(objectUrl);
                setIsPdf(fileSrc.type === "application/pdf");
                return () => URL.revokeObjectURL(objectUrl); // Cleanup URL object
            } else if (typeof fileSrc === 'string')
            {
                setFileUrl(fileSrc);
                setIsPdf(fileSrc.endsWith(".pdf"));
            }
        } else
        {
            setFileUrl(null);
            setIsPdf(false);
        }
    },[fileSrc]);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Lihat {title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {fileUrl ? (
                    isPdf ? (
                        <iframe
                            src={`${fileUrl}#toolbar=0`}
                            style={{
                                minHeight: '50vh',
                                maxHeight: '60vh',
                                maxWidth: '100%',
                                width: '100%',
                                objectFit: 'contain'
                            }}
                            title="PDF Viewer"
                        />
                    ) : (
                        <Image src={fileUrl} fluid />
                    )
                ) : (
                    <p>File tidak dapat ditampilkan.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                {buttonDelete && (
                    <Button variant="danger" onClick={onDelete}>
                        <Trash /> Hapus
                    </Button>
                )}
                <Button variant="secondary" onClick={onHide}>
                    Tutup
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SansFileInput;
