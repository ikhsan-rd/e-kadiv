import '../../css/inputdatabase.scss'
import React,{ useState,useRef } from 'react';
import { Container,Form,Button,Row,Col,Modal,InputGroup,Spinner } from 'react-bootstrap';
import { Eye } from 'react-bootstrap-icons';
import axios from 'axios';
import '../../css/button.scss'
import
{
    SansCropImage,
    SansDatePicker,
    SansDivisiDropdown,
    SansNotify,
    SansFileInput,
    SansDateToSend,
} from '../ComponentCustom/SansComps';

function PelatihInput()
{
    const currentToken = sessionStorage.getItem('token');

    const [loading,setLoading] = useState(false);

    const [formData,setFormData] = useState({
        nama: "",
        npm: "",
        jk: "",
        tempat_lahir: "",
        tgl_lahir: "",
        angkatan: "",
        jurusan: "",
        wa: "",
        divisi: "",
        kategori: "",
        status_mhs: "",
        status_anggota: "",
        ktp: null,
        foto: null,
    });

    const handleChange = (e) =>
    {
        const { name,value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

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

    //ktp
    const ktpInputRef = useRef(null);
    const [showModalPengenal,setShowModalPengenal] = useState(false);

    const handleKtpChange = (e) =>
    {
        const file = e.target.files[0];
        if (file)
        {
            setFormData((prevData) => ({
                ...prevData,
                ktp: file,
            }));
        }
    };

    const handleHapusPengenal = () =>
    {
        setFormData((prevData) => ({
            ...prevData,
            ktp: null,
        }));
        setShowModalPengenal(false);
        if (ktpInputRef.current)
        {
            ktpInputRef.current.value = '';
        }
    };

    const handleCekPengenal = () =>
    {
        setShowModalPengenal(true);
    };

    //Handle Submit
    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach((key) =>
        {
            data.append(key,formData[key]);
        });

        // Ensure both files are added
        if (formData.foto)
        {
            data.append("foto",formData.foto);
        }
        if (formData.ktp)
        {
            data.append("ktp",formData.ktp);
        }

        // Log form data entries for debugging
        console.log("Form Data Entries:");
        for (let pair of data.entries())
        {
            const [key,value] = pair;
            let valueType = typeof value;

            if (value instanceof File)
            {
                valueType = "File";
            }

            console.log(`${key}: ${value} (Type: ${valueType})`);
        }

        const formattedData = {
            ...formData,
            tgl_lahir: SansDateToSend(formData.tgl_lahir),
        };

        try
        {
            await axios.get("http://localhost:8000/sanctum/csrf-cookie",{
                withCredentials: true,
            });

            await axios.post("http://localhost:8000/api/pelatih",formattedData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${currentToken}`,
                },
                withCredentials: true,
            });

            setFormData({
                nama: "",
                jk: "",
                tempat_lahir: "",
                tgl_lahir: "",
                wa: "",
                divisi: "",
                kategori: "",
                status_anggota: "",
                foto: null,
                ktp: null,
            });
            setImageSrc(null);

            if (fileInputRef.current)
            {
                fileInputRef.current.value = "";
            }
            if (ktpInputRef.current)
            {
                ktpInputRef.current.value = "";
            }
            setSuccessMessage("Data Atlet berhasil ditambahkan");
            setStatus('success');
            setShowNotify(true);
        } catch (err)
        {
            setErrorMessage("Terjadi Kesalahan");
            setStatus('error');
            setShowNotify(true);
            console.error("Response data:",err.response.data.message);
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
                <Row style={{ marginBottom: '15px' }}>
                    <Form.Group as={Col} md={3} controlId="nama">
                        <Form.Label>Nama</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder='Masukan Nama'
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3} >
                        <Form.Label>Tempat Lahir</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder='Masukan Tempat Lahir'
                            name="tempat_lahir"
                            value={formData.tempat_lahir}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3} >
                        <Form.Label>Tanggal Lahir</Form.Label>
                        <SansDatePicker
                            value={formData.tgl_lahir}
                            onChange={(date) => setFormData({ ...formData,tgl_lahir: date })}
                            onClear={() => setFormData({ ...formData,tgl_lahir: null })}
                            disabled={loading}
                            required
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="foto">
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
                </Row >
                <Row style={{ marginBottom: '15px' }}>
                    <Form.Group as={Col} md={3} >
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
                    <Form.Group as={Col} md={3}>
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
                    <Form.Group as={Col} md={3} >
                        <Form.Label>Keanggotaan UKM</Form.Label>
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
                    <Form.Group as={Col} md={3} >
                        <Form.Label>KTP/SIM/Lainnya (pdf)</Form.Label>
                        <Form.Group style={{ display: 'flex' }}>
                            <Form.Control
                                type="file"
                                name="ktp"
                                onChange={handleKtpChange}
                                required
                                ref={ktpInputRef}
                                disabled={loading}
                            />
                            {formData.ktp && (
                                <Button variant="primary" onClick={handleCekPengenal} className='button-see'>
                                    <Eye className='eye-custom' />
                                </Button>
                            )}
                        </Form.Group>
                    </Form.Group>
                </Row>
                <Row style={{ marginBottom: '20px' }}>
                    <Form.Group as={Col} md={3} >
                        <Form.Label>Divisi</Form.Label>
                        <SansDivisiDropdown
                            value={formData.divisi}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3} >
                        <Form.Label>Kategori</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="*Opsional"
                            name="kategori"
                            value={formData.kategori}
                            onChange={handleChange}
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
                    {loading ? (
                        <Spinner animation="border" size="sm" />
                    ) : 'Tambah'}
                </Button>
            </Modal.Footer>
            </Form>

            {formData.ktp && (
                <SansFileInput
                    show={showModalPengenal}
                    onHide={() => setShowModalPengenal(false)}
                    fileSrc={formData.ktp}
                    onDelete={handleHapusPengenal}
                />
            )}

            {imageSrc && (
                <SansCropImage
                    imageSrc={imageSrc}
                    show={showCropper}
                    onHide={() => setShowCropper(false)}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCancel}
                    rasio={3 / 4}
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
}

export default PelatihInput;