import "../../css/button.scss";
import React,{ useState,useEffect,useRef } from "react";
import { Row,Form,Col,Button,Container,Spinner,Modal } from "react-bootstrap";
import { Eye,EyeSlash } from "react-bootstrap-icons";
import axios from "axios";
import { SansCropImage,SansDivisiDropdown,SansNotify } from "../ComponentCustom/SansComps";

const AkunInput = () =>
{
    const currentToken = sessionStorage.getItem('token');

    const [loading,setLoading] = useState(false);

    const [formData,setFormData] = useState({
        nomor_anggota: "",
        nama: "",
        fe_password: "",
        jabatan: "",
        divisi: "",
        foto: null,
    });

    // Handle perubahan data pada form
    const handleChange = (e) =>
    {
        const { name,value,type,files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    // Handle jika jabatan puspendiv
    useEffect(() =>
    {
        let newDivisi = formData.divisi;

        if (formData.jabatan === "Puspendiv")
        {
            newDivisi = "-";
        } else if (newDivisi === "-")
        {
            newDivisi = "";
        }

        setFormData(prevState => ({
            ...prevState,
            divisi: newDivisi,
        }));
    },[formData.jabatan,formData.divisi]);

    // Handle Image crop dan cancel
    const [imageSrc,setImageSrc] = useState(null);
    const [showCropper,setShowCropper] = useState(false);
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
        }
    };

    const handleCropComplete = (croppedBlob) =>
    {
        setFormData(prevData => ({
            ...prevData,
            foto: croppedBlob,
        }));
        setImageSrc(null);
        setShowCropper(false);
    };

    const handleCancel = () =>
    {
        setImageSrc(null);
        setFormData(prevData => ({
            ...prevData,
            foto: null,
        }));
        if (fileInputRef.current)
        {
            fileInputRef.current.value = '';
        }
    };

    // Handle see password
    const [passwordVisible,setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () =>
    {
        setPasswordVisible(!passwordVisible);
    };

    // Submit
    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key =>
        {
            data.append(key,formData[key]);
        });

        try
        {
            // Fetch the CSRF token
            await axios.get("http://localhost:8000/sanctum/csrf-cookie",{
                withCredentials: true,
            });

            // Add akun request
            await axios.post("http://localhost:8000/api/register",data,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${currentToken}`,
                },
                withCredentials: true,
            });

            setFormData({
                nomor_anggota: "",
                nama: "",
                fe_password: "",
                jabatan: "",
                divisi: "",
                foto: null,
            });
            setImageSrc(null);

            if (fileInputRef.current)
            {
                fileInputRef.current.value = "";
            }
            setSuccessMessage("Data akun berhasil ditambahkan");
            setStatus('success');
            setShowNotify(true);
        } catch (err)
        {
            setStatus('error');
            setShowNotify(true);
            if (err.response && err.response.data.message)
            {
                setErrorMessage(err.response.data.message);
            } else
            {
                setErrorMessage("Terjadi Kesalahan");
                console.error("Response data:",err.response.data);
            }
        } finally 
        {
            setLoading(false);
        }
    };

    //notify
    const [status,setStatus] = useState(null);
    const [showNotify,setShowNotify] = useState(false);
    const [successMessage,setSuccessMessage] = useState("");
    const [errorMessage,setErrorMessage] = useState("");

    const handleCloseNotify = () =>
    {
        setShowNotify(false);
        setSuccessMessage("");
        setErrorMessage("");
        setTimeout(() =>
        {
            setStatus(null);
        },100);
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Row style={{ marginBottom: "15px" }}>
                    <Form.Group as={Col} md={4}>
                        <Form.Label>Nama Lengkap</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Masukkan nama lengkap"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Username atau Nomor Anggota"
                            name="nomor_anggota"
                            value={formData.nomor_anggota}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
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
                                value={formData.fe_password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                minLength={8}
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
                <Row style={{ marginBottom: "20px" }}>
                    <Form.Group as={Col} md={4}>
                        <Form.Label>Jabatan</Form.Label>
                        <Form.Control
                            as="select"
                            name="jabatan"
                            value={formData.jabatan}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">Pilih Jabatan</option>
                            <option value="Puspendiv">Puspendiv</option>
                            <option value="Kadiv">Kadiv</option>
                            <option value="Pelatih">Pelatih</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                        <Form.Label>Divisi</Form.Label>
                        <SansDivisiDropdown
                            value={formData.jabatan === "Puspendiv" ? "-" : formData.divisi}
                            onChange={handleChange}
                            disabled={formData.jabatan === "Puspendiv" || loading}
                            required={formData.jabatan !== "Puspendiv"}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                        <Form.Label>Foto</Form.Label>
                        <Form.Control
                            type="file"
                            name="foto"
                            onChange={handleImageChange}
                            required
                            ref={fileInputRef}
                            disabled={loading}
                        />
                    </Form.Group>
                </Row>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                        style={{ width: "30%",margin: "5px 35% 0 35%" }}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
                    </Button>
                </Modal.Footer>
            </Form>

            {imageSrc && (
                <SansCropImage
                    imageSrc={imageSrc}
                    show={showCropper}
                    onHide={() => setShowCropper(false)}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCancel}
                    rasio={1}
                />
            )}

            <SansNotify
                show={showNotify}
                onHide={handleCloseNotify}
                status={status}
                onSuccess={successMessage}
                onError={errorMessage}
            />
        </>
    );
};

export default AkunInput;
