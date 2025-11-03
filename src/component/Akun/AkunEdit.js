import React,{ useState,useRef,useEffect } from 'react';
import { Form,Button,Spinner,Modal,Col,Row } from 'react-bootstrap';
import axios from 'axios';
import { PencilSquare,XLg,Eye,EyeSlash } from 'react-bootstrap-icons';
import { SansCropImage,SansDivisiDropdown,SansLoadOrNotImage } from "../ComponentCustom/SansComps";
import '../../css/button.scss'
function AkunEdit({
    formData,
    setFormData,
    loading,
    setLoading,
    isEditing,
    isEditingPhoto,
    setIsEditingPhoto,
    editingRowId,
    handleCancelClick,
    setStatus,
    setShowNotify,
    setErrorMessage,
    setSuccessMessage,
    fetchTableData
})
{
    const currentToken = sessionStorage.getItem('token');
    const currentJabatan = sessionStorage.getItem('jabatan');

    const [croppedImage,setCroppedImage] = useState(null);
    const [imageSrc,setImageSrc] = useState(null);
    const [showCropper,setShowCropper] = useState(false);
    const fileInputRef = useRef(null);
    const [selectedFile,setSelectedFile] = useState(null);

    //handle foto
    const handleFileChange = (e) =>
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
            setSelectedFile(file);
            console.log('selected:',selectedFile);
        }
    };

    const handleCropComplete = (croppedBlob) =>
    {
        setCroppedImage(croppedBlob);
        setImageSrc(null);
        setShowCropper(false);
    };

    const handleChangeFoto = () =>
    {
        setIsEditingPhoto(true);
    };

    const handleCancelChangeFoto = () =>
    {
        setIsEditingPhoto(false);
    };

    //handle Data Change
    const handleChange = (e) =>
    {
        const { name,value } = e.target;
        setFormData(prevData => ({
            ...prevData,[name]: value
        }));
    };

    // Handle see password
    const [passwordVisible,setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () =>
    {
        setPasswordVisible(!passwordVisible);
    };

    //handle Edit
    const handleEditSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);
        try
        {
            await axios.get("http://localhost:8000/sanctum/csrf-cookie",{
                withCredentials: true,
            });

            if (!currentToken)
            {
                throw new Error("currentToken not found");
            }
            
            console.log(croppedImage);

            await axios.put(`http://localhost:8000/api/user/${editingRowId}`,formData,{
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

                await axios.post(
                    `http://localhost:8000/api/user/${editingRowId}/upload`,
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
            setSuccessMessage("Data akun berhasil diubah");
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
            <Modal show={isEditing}  style={{borderRadius: '5px' }} onHide={handleCancelClick} size='md' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Akun</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                                                onChange={handleFileChange}
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
                                                width="80px"
                                                height="80px"
                                                shape="square"
                                            />
                                            <PencilSquare
                                                type='button'
                                                className='edit-custom-2'
                                                onClick={handleChangeFoto}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <Form.Label>Edit Foto</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="foto"
                                                onChange={handleFileChange}
                                                ref={fileInputRef}
                                                disabled={loading}
                                            />
                                        </>
                                    )
                                )}
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nomor_anggota"
                                    value={formData.nomor_anggota}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </Form.Group>
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Form.Group as={Col} >
                                <Form.Label>Nama</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Password</Form.Label>
                                <div
                                    className="password-wrapper"
                                    style={{ position: "relative" }}
                                >
                                    <Form.Control
                                        id="eye"
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder="Password"
                                        name="fe_password"
                                        minLength={8}
                                        value={formData.fe_password}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                    <Button
                                        variant="secondary"
                                        onClick={togglePasswordVisibility}
                                        className="toggle-password-button"
                                        style={{ marginRight: "1px" }}
                                    >
                                        {passwordVisible ? <Eye className="eye-password" /> : <EyeSlash className="eyeSlash-password" />}
                                    </Button>
                                </div>
                            </Form.Group>
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Form.Group as={Col} controlId="formJabatan">
                                <Form.Label>Jabatan</Form.Label>
                                <Form.Select
                                    name="jabatan"
                                    value={formData.jabatan}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Pilih Jabatan</option>
                                    {(currentJabatan === 'Admin') && (<option value="Admin">Admin</option>)}
                                    {(currentJabatan === 'Admin' || currentJabatan === 'Puspendiv') && (<option value="Puspendiv">Puspendiv</option>)}
                                    <option value="Kadiv">Kadiv</option>
                                    <option value="Pelatih">Pelatih</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formDivisi">
                                <Form.Label>Divisi</Form.Label>
                                <SansDivisiDropdown
                                    value={(formData.jabatan === "Admin" || formData.jabatan === "Puspendiv") ? "-" : formData.divisi}
                                    onChange={handleChange}
                                    disabled={formData.jabatan === "Puspendiv" || formData.jabatan === "Admin" || loading}
                                    required={formData.jabatan !== "Puspendiv"}
                                    setLoading={setLoading}
                                />
                            </Form.Group>
                        </Row>

                        <Modal.Footer>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Update'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            {imageSrc && (
                <SansCropImage
                    imageSrc={imageSrc}
                    show={showCropper}
                    onHide={() => setShowCropper(false)}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCancelChangeFoto}
                    rasio={1}
                />
            )}

        </>
    );
}

export default AkunEdit;
