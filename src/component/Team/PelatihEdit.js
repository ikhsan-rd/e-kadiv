import React,{ useState,useRef } from 'react';
import { Form,Button,Spinner,Modal,Col,Row,InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { Eye,PencilSquare,XLg } from 'react-bootstrap-icons';
import '../../css/button.scss';
import
{
    SansCropImage,
    SansDatePicker,
    SansFileInput,
    SansLoadOrNotImage,
    SansDivisiDropdown,
    SansDateToSend,
    SansButtonEdit,
} from '../ComponentCustom/SansComps';

function PelatihEdit({
    formData,
    setFormData,
    loading,
    setLoading,
    editingRowId,

    isEditingPhoto,
    setIsEditingPhoto,
    isEditingFile,
    setIsEditingFile,
    doneFile,
    setDoneFile,
    selectedFile,
    setSelectedFile,

    handleCancelClick,
    setStatus,
    setShowNotify,
    setErrorMessage,
    setSuccessMessage,
    fetchTableData,
})
{
    const currentToken = sessionStorage.getItem('token');

    const handleChange = (e) =>
    {
        const { name,value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePencilClick = () =>
    {
        setIsEditingPhoto(true);
    };

    // Handle Image crop dan cancel
    const [croppedImage,setCroppedImage] = useState(null);
    const [imageSrc,setImageSrc] = useState(null);
    const [showCropper,setShowCropper] = useState(false);
    const [selectedFoto,setSelectedFoto] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) =>
    {
        const file = e.target.files[0];
        if (file)
        {
            const reader = new FileReader();
            reader.onloadend = () =>
            {
                setImageSrc(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
            setSelectedFoto(file);
            console.log('selected:',selectedFoto);
        }
    };

    const handleCropComplete = (croppedBlob) =>
    {
        setCroppedImage(croppedBlob);
        setImageSrc(null);
        setShowCropper(false);
    };

    const handleCancelChangeFoto = () =>
    {
        setIsEditingPhoto(false);
    };

    //ktm sia
    const ktpInputRef = useRef(null);
    const [showModalPengenal,setShowModalPengenal] = useState(false);

    //handle foto
    const handleChangeFile = (e) =>
    {
        const file = e.target.files[0];
        setFormData({ ...formData,ktp: file.name });

        setSelectedFile(file);
        setIsEditingFile(true);
        setDoneFile(true);
    };

    const handleEditFile = () =>
    {
        setIsEditingFile(true);
    };

    const handleCancelChangeFile = () =>
    {
        setIsEditingFile(false);
        setShowModalPengenal(false);
        setDoneFile(false);
        setSelectedFile(false);
    };

    const handleCekPengenal = () =>
    {
        setShowModalPengenal(true);
    };

    //handle Submit
    const handleEditSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        // if (croppedImage.size > 10 * 1024 * 1024)
        // { // 10MB
        //     setErrorMessage("Foto Maksimal 10MB");
        //     setStatus('error');
        //     setShowNotify(true);
        //     return;
        // }

        // if (selectedFile.size > 10 * 1024 * 1024)
        // { // 10MB
        //     setErrorMessage("File Maksimal 10MB");
        //     setStatus('error');
        //     setShowNotify(true);
        //     return;
        // }

        const formattedData = {
            ...formData,
            tgl_lahir: SansDateToSend(formData.tgl_lahir),
        };

        console.log(formattedData);
        console.log(croppedImage);
        console.log(selectedFile);
        console.log(editingRowId);

        try
        {
            // Fetch CSRF token
            await axios.get("http://localhost:8000/sanctum/csrf-cookie",{
                withCredentials: true,
            });
            if (!currentToken)
            {
                throw new Error("currentToken not found");
            }
            // Update user data
            await axios.put(`http://localhost:8000/api/pelatih/${editingRowId}`,formattedData,{
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            const fileData = new FormData();
            if (croppedImage)
            {
                fileData.append("foto",croppedImage);
            }
            if (selectedFile && isEditingFile)
            {
                fileData.append("ktp",selectedFile);
            }
            if (croppedImage || selectedFile)
            {
                await axios.post(
                    `http://localhost:8000/api/pelatih/${editingRowId}/upload`,
                    fileData,
                    {
                        headers: {
                            Authorization: `Bearer ${currentToken}`,
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                    }
                );
            }

            setImageSrc(null);
            setCroppedImage(null);
            setSelectedFile(null);
            setSelectedFoto(null);

            setSuccessMessage("Data Pelatih berhasil diubah");
            setStatus('success');
            setShowNotify(true);
            fetchTableData();
            handleCancelClick();
        } catch (error)
        {
            setErrorMessage("Terjadi Kesalahan");
            setStatus('error');
            setShowNotify(true);
            console.error("Error updating data:",error);
            if (error.response)
            {
                console.error("Response data:",error.response.data);
            }
        } finally
        {
            setLoading(false);
        }
    };

    return (
        <>
            <Form onSubmit={handleEditSubmit}>
                <Row style={{ marginBottom: '10px' }}>
                    <Form.Group as={Col}>
                        {isEditingPhoto ? (
                            <>
                                <Form.Label>Edit Foto</Form.Label>
                                <Form.Group as={Col} style={{ display: 'flex' }}>
                                    <Form.Control
                                        type="file"
                                        name="foto"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                        disabled={loading}
                                    />
                                    <Button onClick={handleCancelChangeFoto}
                                        variant='danger'
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            width: '38px',
                                            height: '38px',
                                            padding: '9px',
                                            marginLeft: '5px'
                                        }}>
                                        <XLg
                                            style={{
                                                width: '18px',
                                                height: '18px'
                                            }} />
                                    </Button>
                                </Form.Group>
                            </>
                        ) : (
                            formData.foto ? (
                                <div style={{ display: 'flex',alignItems: 'flex-start',marginLeft: '25%' }}>
                                    <SansLoadOrNotImage
                                        src={formData.foto}
                                        height="80px"
                                        width="80px"
                                        shape='circle'
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
                                        disabled={loading}
                                    />
                                </>
                            )
                        )}
                    </Form.Group>
                    <Form.Group as={Col} controlId="formNama">
                        <Form.Label>Nama</Form.Label>
                        <Form.Control
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                </Row>
                <Row style={{ marginBottom: '10px' }}>
                    <Form.Group as={Col} controlId="formNomorAnggota">
                        <Form.Label>Tempat Lahir</Form.Label>
                        <Form.Control
                            type="text"
                            name="tempat_lahir"
                            value={formData.tempat_lahir}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Tanggal Lahir</Form.Label>
                        <SansDatePicker
                            value={formData.tgl_lahir}
                            onChange={(date) => setFormData({ ...formData,tgl_lahir: date })}
                            onClear={() => setFormData({ ...formData,tgl_lahir: null })}
                            disabled={loading}
                            required
                        />
                    </Form.Group>
                </Row>
                <Row style={{ marginBottom: '10px' }}>
                    <Form.Group as={Col} controlId="formNomorAnggota">
                        <Form.Label>Jenis Kelamin</Form.Label>
                        <Form.Select
                            name="jk"
                            value={formData.jk}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">Pilih</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Whatsapp</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>+62</InputGroup.Text>
                            <Form.Control
                                type="text"
                                name='wa'
                                value={formData.wa}
                                onChange={handleChange}
                                placeholder='tulis tanpa 0 atau +62'
                                maxLength={15}
                                disabled={loading}
                                required
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Anggota UKM</Form.Label>
                        <Form.Select
                            name="status_anggota"
                            value={formData.status_anggota}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">Pilih</option>
                            <option value="Y">Anggota</option>
                            <option value="N">Non-Anggota</option>
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Row style={{ marginBottom: '10px' }}>
                    <Form.Group as={Col} controlId="formDivisi">
                        <Form.Label>Divisi</Form.Label>
                        <SansDivisiDropdown
                            value={formData.divisi}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formJabatan">
                        <Form.Label>Kategori</Form.Label>
                        < Form.Control
                            type="text"
                            placeholder="*Opsional"
                            name="kategori"
                            value={formData.kategori}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>KTP/SIM</Form.Label>
                        <Form.Group style={{ display: 'flex' }}>
                            {isEditingFile ? (
                                <>
                                    <Form.Control
                                        type="file"
                                        name="ktm_sia"
                                        onChange={handleChangeFile}
                                        required
                                        ref={ktpInputRef}
                                        disabled={loading}
                                    />
                                    {doneFile && (
                                        <Button
                                            variant="primary"
                                            onClick={handleCekPengenal}
                                            className='button-see'
                                        >
                                            <Eye className='eye-custom' />
                                        </Button>
                                    )}
                                </>
                            ) : (
                                selectedFile ? (
                                    <>
                                        <Button
                                            variant="primary"
                                            onClick={handleCekPengenal}
                                            className='button-see'
                                        >
                                            <Eye className='eye-custom' />
                                        </Button>
                                        <SansButtonEdit
                                            onClick={handleEditFile}
                                        />
                                    </>
                                ) : (
                                    <Form.Control
                                        type="file"
                                        name="ktm_sia"
                                        onChange={handleChangeFile}
                                        required
                                        ref={ktpInputRef}
                                        disabled={loading}
                                    />
                                )
                            )}
                        </Form.Group>
                    </Form.Group>
                </Row>
                <Modal.Footer>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Update'}
                    </Button>
                </Modal.Footer>
            </Form >

            {
                formData.ktp && (
                    <SansFileInput
                        show={showModalPengenal}
                        onHide={() => setShowModalPengenal(false)}
                        fileSrc={selectedFile}
                        onDelete={handleCancelChangeFile}
                    />
                )
            }

            {
                imageSrc && (
                    <SansCropImage
                        imageSrc={imageSrc}
                        show={showCropper}
                        onHide={() => setShowCropper(false)}
                        onCropComplete={handleCropComplete}
                        onCancel={handleCancelChangeFoto}
                        rasio={3 / 4}
                    />
                )
            }
        </>
    );
}

export default PelatihEdit;
