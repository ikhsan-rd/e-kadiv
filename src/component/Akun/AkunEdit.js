import React,{ useState,useRef,useCallback } from 'react';
import { Form,Button,Spinner,Modal,Col,Row } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { PencilSquare } from 'react-bootstrap-icons';
// import Cropper from "react-easy-crop";
// import getCroppedImg from "../ComponentCustom/cropImage";
import '../../css/button.scss';

function AkunEdit({ formData,setFormData,handleCancelClick,loading,setLoading,editingRowId })
{
    // const [isEditingPhoto,setIsEditingPhoto] = useState(false);
    const navigate = useNavigate();

    // const [crop,setCrop] = useState({ x: 0,y: 0 });
    // const [zoom,setZoom] = useState(1);
    // const [croppedArea,setCroppedArea] = useState(null);
    // const [imageSrc,setImageSrc] = useState(null);
    // const [showCropper,setShowCropper] = useState(false);
    // const [imageFile,setImageFile] = useState(null);
    // const fileInputRef = useRef(null);

    // const onCropComplete = useCallback(
    //     (croppedAreaPercentage,croppedAreaPixels) =>
    //     {
    //         setCroppedArea(croppedAreaPixels);
    //     },
    //     []
    // );

    // const handleImageChange = async (e) =>
    // {
    //     const file = e.target.files[0];
    //     if (file)
    //     {
    //         const reader = new FileReader();
    //         reader.onloadend = () =>
    //         {
    //             setImageSrc(reader.result);
    //             setShowCropper(true);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    // const handleCrop = async () =>
    // {
    //     if (croppedArea)
    //     {
    //         const croppedBlob = await getCroppedImg(imageSrc,croppedArea);
    //         setImageFile(croppedBlob);
    //         setShowCropper(false);
    //         setIsEditingPhoto(true);
    //     }
    // };

    // const handleCloseCrop = () =>
    // {
    //     setShowCropper(false);
    //     setImageSrc(null);
    //     setCroppedArea(null);
    //     if (fileInputRef.current)
    //     {
    //         fileInputRef.current.value = "";
    //     }
    // };

    const handleChange = (e) =>
    {
        const { name,value } = e.target;
        setFormData(prevData => ({ ...prevData,[name]: value }));
    };

    // const handleFileChange = (e) =>
    // {
    //     setFormData(prevData => ({ ...prevData,foto: e.target.files[0] }));
    // };


    // const handlePencilClick = () =>
    // {
    //     setIsEditingPhoto(true);
    // };

    const handleEditSubmit = async (e) =>
    {
        e.preventDefault();

        // Validasi input
        if (!formData.nama || !formData.nomor_anggota || !formData.fe_password || !formData.divisi || !formData.jabatan)
        {
            alert("Semua field harus diisi dengan benar.");
            setLoading(false);
            return;
        }

        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach((key) =>
        {
            if (formData[key] !== undefined && formData[key] !== null)
            {
                data.append(key,formData[key]);
            }
        });

        // if (imageFile)
        // {
        //     data.append('foto',imageFile,formData.nomor_anggota);
        // }

        // Log to debug data
        console.log('Form Data Entries:');
        for (let pair of data.entries())
        {
            const [key,value] = pair;
            let valueType = typeof value;

            // Check if value is a File object
            if (value instanceof File)
            {
                valueType = 'File';
            }

            console.log(`${key}: ${value} (Type: ${valueType})`);
        }
        try
        {
            // Fetch the CSRF token
            await axios.get("http://localhost:8000/sanctum/csrf-cookie",{
                withCredentials: true,
            });

            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/api/user/${editingRowId}`,data,{
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
        } catch (err)
        {
            console.error("Update failed:",err);
            if (err.response)
            {
                console.error("Response data:",err.response.data);
                console.error("Response status:",err.response.status);
                console.error("Response headers:",err.response.headers);
            }
        } finally
        {
            handleCancelClick();
            setLoading(false);
        }
    };



    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Edit Akun</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleEditSubmit}>
                    <Row style={{ marginBottom: '10px' }}>
                        {/* <Form.Group as={Col} controlId="formFoto">
                            {isEditingPhoto ? (
                                <>
                                    <Form.Label>Edit Foto</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="foto"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                    />
                                </>
                            ) : (
                                formData.foto ? (
                                    <div style={{ display: 'flex',alignItems: 'flex-start',marginLeft: '25%' }}>
                                        <img
                                            src={formData.foto}
                                            alt="Foto"
                                            style={{ maxWidth: '80px',maxHeight: '80px',borderRadius: '5%' }}
                                        />
                                        <PencilSquare
                                            type='button'
                                            className='edit-custom-2'
                                            onClick={handlePencilClick}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <Form.Label>Edit Foto</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="foto"
                                            onChange={handleImageChange}
                                            ref={fileInputRef}
                                        />
                                    </>
                                )
                            )}
                        </Form.Group> */}
                        <Form.Group as={Col} controlId="formNama">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                type="text"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                placeholder="Nama"
                            />
                        </Form.Group>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Form.Group as={Col} controlId="formNomorAnggota">
                            <Form.Label>Nomor Anggota</Form.Label>
                            <Form.Control
                                type="text"
                                name="nomor_anggota"
                                value={formData.nomor_anggota}
                                onChange={handleChange}
                                placeholder="Nomor Anggota"
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="fe_password"
                                minLength={8}
                                value={formData.fe_password}
                                onChange={handleChange}
                                placeholder="Password"
                            />
                        </Form.Group>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Form.Group as={Col} controlId="formDivisi">
                            <Form.Label>Divisi</Form.Label>
                            <Form.Control
                                type="text"
                                name="divisi"
                                value={formData.divisi}
                                onChange={handleChange}
                                placeholder="Divisi"
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formJabatan">
                            <Form.Label>Jabatan</Form.Label>
                            < Form.Control
                                type="text"
                                name="jabatan"
                                value={formData.jabatan}
                                onChange={handleChange}
                                placeholder="Jabatan"
                            />
                        </Form.Group>
                    </Row>

                    <Modal.Footer>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Update'}
                        </Button>
                        <Button variant="secondary" onClick={handleCancelClick} disabled={loading}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>

            {/* <Modal
                show={showCropper}
                onHide={() => setShowCropper(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Crop Foto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "400px",
                        }}
                    >
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCrop}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCrop}>
                        Crop
                    </Button>
                </Modal.Footer>
            </Modal> */}
        </>
    );
}

export default AkunEdit;
