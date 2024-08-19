import "../../css/button.scss";
import React,{ useState,useCallback,useEffect,useRef } from "react";
import { Row,Form,Col,Button,Container,Modal } from "react-bootstrap";
import { Eye,EyeSlash } from "react-bootstrap-icons";
import axios from "axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../ComponentCustom/cropImage";
import { useNavigate } from "react-router-dom";

const AkunInput = () =>
{
    const [formData,setFormData] = useState({
        nomor_anggota: "",
        nama: "",
        fe_password: "",
        jabatan: "",
        divisi: "",
        foto: null,
    });

    const [passwordVisible,setPasswordVisible] = useState(false);
    const [loading,setLoading] = useState(false);
    const [success,setSuccess] = useState(null);
    const [error,setError] = useState(null);
    const navigate = useNavigate();


    const [crop,setCrop] = useState({ x: 0,y: 0 });
    const [zoom,setZoom] = useState(1);
    const [croppedArea,setCroppedArea] = useState(null);
    const [imageSrc,setImageSrc] = useState(null);
    const [showCropper,setShowCropper] = useState(false);
    const [imageFile,setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) =>
    {
        const { name,value,type,files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value,
        }));
    };

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

        setFormData((prevState) => ({
            ...prevState,
            divisi: newDivisi,
        }));
    },[formData.jabatan,formData.divisi]);

    const onCropComplete = useCallback(
        (croppedAreaPercentage,croppedAreaPixels) =>
        {
            setCroppedArea(croppedAreaPixels);
        },
        []
    );

    const handleImageChange = async (e) =>
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

    const handleCrop = async () =>
    {
        if (croppedArea)
        {
            const croppedBlob = await getCroppedImg(imageSrc,croppedArea);
            setImageFile(croppedBlob);
            setShowCropper(false);
        }
    };

    const handleCloseCrop = () =>
    {
        setShowCropper(false);
        setImageSrc(null);
        setCroppedArea(null);
        if (fileInputRef.current)
        {
            fileInputRef.current.value = "";
        }
    };

    const togglePasswordVisibility = () =>
    {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach((key) =>
        {
            data.append(key,formData[key]);
        });

        if (imageFile)
        {
            data.append('foto',imageFile,formData.nomor_anggota);
        }

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

            // add akun request
            await axios.post("http://localhost:8000/api/register",data,{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            setSuccess("Registration successful!");
            setError(null);
            alert("Registration successful!");

            // Clear form and image data after successful submission
            setFormData({
                nomor_anggota: "",
                nama: "",
                fe_password: "",
                jabatan: "",
                divisi: "",
                foto: null,
            });
            setImageSrc(null);
            setImageFile(null);

            if (fileInputRef.current)
            {
                fileInputRef.current.value = "";
            }

        } catch (err)
        {
            setError("Registration failed. Please try again.");
            setSuccess(null);
            alert("Registration failed. Please try again.");
        }
        setLoading(false);
    };

    return (
        <Container
            style={{
                backgroundColor: "whitesmoke",
                padding: "2%",
                borderRadius: "10px",
            }}
        >
            <Form style={{ marginTop: "15px" }} onSubmit={handleSubmit}>
                <h2>Tambah Akun</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
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
                            />
                            <Button
                                variant="secondary"
                                onClick={togglePasswordVisibility}
                                className="toggle-password-button"
                                style={{ marginRight: "1px" }}
                            >
                                {passwordVisible ? <Eye /> : <EyeSlash />}
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
                        >
                            <option value="">Pilih Jabatan</option>
                            <option value="Puspendiv">Puspendiv</option>
                            <option value="Kadiv">Kadiv</option>
                            <option value="Pelatih">Pelatih</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                        <Form.Label>Divisi</Form.Label>
                        <Form.Control
                            as="select"
                            name="divisi"
                            value={
                                formData.jabatan === "Puspendiv"
                                    ? "-"
                                    : formData.divisi
                            }
                            onChange={handleChange}
                            disabled={formData.jabatan === "Puspendiv"}
                            required={formData.jabatan !== "Puspendiv"}
                        >
                            <option value="">Pilih divisi</option>
                            <option value="Sepak Bola">Sepak Bola</option>
                            <option value="Bulu Tangkis">Bulu Tangkis</option>
                            <option value="Bola Voli">Bola Voli</option>
                            <option value="Futsal">Futsal</option>
                            <option value="Beladiri">Bela Diri(Silat)</option>
                            {formData.jabatan === "Puspendiv" && (
                                <option value="-" selected>
                                    -
                                </option>
                            )}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                        <Form.Label>Foto</Form.Label>
                        <Form.Control
                            type="file"
                            name="foto"
                            onChange={handleImageChange}
                            required
                            ref={fileInputRef}
                        />
                    </Form.Group>
                </Row>
                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    style={{ width: "30%",margin: "5px 35% 0 35%" }}
                >
                    {loading ? "Menambahkan..." : "Tambah Akun"}
                </Button>
            </Form>

            <Modal
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
            </Modal>
        </Container>
    );
};

export default AkunInput;
