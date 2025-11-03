import '../../css/inputdatabase.scss';
import React,{ useState,useRef } from 'react';
import { Container,Form,Button,Row,Col,Modal,InputGroup,Spinner } from 'react-bootstrap';
import { Eye } from 'react-bootstrap-icons';
import axios from 'axios';
import
{
    SansCropImage,
    SansDatePicker,
    SansDivisiDropdown,
    SansNotify,
    SansFileInput,
    SansDateToSend,
} from '../ComponentCustom/SansComps';

function AtletInput()
{
    const currentToken = sessionStorage.getItem('token');

    const [loading,setLoading] = useState(false);

    // Initialize form data state
    const [formData,setFormData] = useState({
        npm: "",
        nama: "",
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
        foto: null,
        ktm_sia: null,
    });

    const handleChange = (e) =>
    {
        const { name,value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    //Handle Tahun Angkatan
    const handleChangeNpm = (event) =>
    {
        const inputNpm = event.target.value;

        // Calculate year of entry if NPM has at least 2 characters
        const angkatan = inputNpm.length >= 2 ? `20${inputNpm.substring(0,2)}` : '';

        // Update formData in one state update
        setFormData((prevFormData) => ({
            ...prevFormData,
            npm: inputNpm,
            angkatan: angkatan
        }));
    };

    //Whatsapp
    // const handlePhoneNumberChange = (formattedValue) =>
    // {
    //     setFormData(prevData => ({
    //         ...prevData,
    //         wa: formattedValue,
    //     }));
    // };

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

    //ktm sia
    const ktmInputRef = useRef(null);
    const [showModalPengenal,setShowModalPengenal] = useState(false);

    const handleKtmSiaChange = (e) =>
    {
        const file = e.target.files[0];
        if (file)
        {
            setFormData((prevData) => ({
                ...prevData,
                ktm_sia: file,
            }));
        }
    };

    const handleHapusPengenal = () =>
    {
        setFormData((prevData) => ({
            ...prevData,
            ktm_sia: null,
        }));
        setShowModalPengenal(false);
        if (ktmInputRef.current)
        {
            ktmInputRef.current.value = '';
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
        if (formData.ktm_sia)
        {
            data.append("ktm_sia",formData.ktm_sia);
        }

        // Log form data entries for debugging
        // console.log("Form Data Entries:");
        // for (let pair of data.entries())
        // {
        //     const [key,value] = pair;
        //     let valueType = typeof value;

        //     if (value instanceof File)
        //     {
        //         valueType = "File";
        //     }

        //     console.log(`${key}: ${value} (Type: ${valueType})`);
        // }

        const formattedData = {
            ...formData,
            tgl_lahir: SansDateToSend(formData.tgl_lahir),
        };

        try
        {
            await axios.get("http://localhost:8000/sanctum/csrf-cookie",{
                withCredentials: true,
            });

            await axios.post("http://localhost:8000/api/atlet",formattedData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${currentToken}`,
                },
                withCredentials: true,
            });
            resetForm();
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

    const resetForm = () =>
    {
        // Clear form and image data after successful submission
        setFormData({
            npm: "",
            nama: "",
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
            foto: null,
            ktm_sia: null,
        });
        setImageSrc(null);

        if (fileInputRef.current)
        {
            fileInputRef.current.value = "";
        }
        if (ktmInputRef.current)
        {
            ktmInputRef.current.value = "";
        }
    }

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
                    <Form.Group as={Col} md={3} controlId="tempat_lahir">
                        <Form.Label>Tempat Lahir</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder='Masukan Tanggal Lahir'
                            name="tempat_lahir"
                            value={formData.tempat_lahir}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="tanggalLahir" >
                        <Form.Label>Tanggal Lahir</Form.Label>
                        <SansDatePicker
                            value={formData.tgl_lahir}
                            onChange={(date) => setFormData({ ...formData,tgl_lahir: date })}
                            onClear={() => setFormData({ ...formData,tgl_lahir: null })}
                            disabled={loading}
                            required
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3}>
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
                <Row style={{ marginBottom: '15px' }}>
                    <Form.Group as={Col} md={2} controlId="jeniskelamin">
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
                    <Form.Group as={Col} md={2} controlId="npm">
                        <Form.Label>NPM</Form.Label>
                        <Form.Control
                            type="text"
                            name='npm'
                            placeholder="Masukkan NPM"
                            value={formData.npm}
                            maxLength={15}
                            onChange={handleChangeNpm}
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={1} controlId="angkatan">
                        <Form.Label>Angkatan</Form.Label>
                        <Form.Control
                            type="text"
                            name="angkatan"
                            value={formData.angkatan}
                            disabled={true}
                            style={{ backgroundColor: '#fff' }}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={2} controlId="jurusan">
                        <Form.Label>Jurusan</Form.Label>
                        <Form.Control
                            type="text"
                            name="jurusan"
                            value={formData.jurusan}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={2} controlId="statusmhs">
                        <Form.Label>Status Mahasiswa</Form.Label>
                        <Form.Select
                            name="status_mhs"
                            value={formData.status_mhs}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">Pilih</option>
                            <option value="Y">Aktif</option>
                            <option value="N">Tidak Aktif</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="pengenal">
                        <Form.Label>KTM/SIA (pdf)</Form.Label>
                        <Form.Group style={{ display: 'flex' }}>
                            <Form.Control
                                type="file"
                                name="ktm_sia"
                                onChange={handleKtmSiaChange}
                                required
                                ref={ktmInputRef}
                                disabled={loading}
                            />
                            {formData.ktm_sia && (
                                <Button variant="primary" onClick={handleCekPengenal} className='button-see'>
                                    <Eye className='eye-custom' />
                                </Button>
                            )}
                        </Form.Group>
                    </Form.Group>
                </Row>
                <Row style={{ marginBottom: '20px' }}>
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
                    <Form.Group as={Col} md={3} controlId="divisi">
                        <Form.Label>Divisi</Form.Label>
                        <SansDivisiDropdown
                            value={formData.divisi}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId="kategori">
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
                    <Form.Group as={Col} md={3} controlId="statusanggota">
                        <Form.Label>Status Keanggotaan UKM</Form.Label>
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

            {formData.ktm_sia && (
                <SansFileInput
                    show={showModalPengenal}
                    onHide={() => setShowModalPengenal(false)}
                    fileSrc={formData.ktm_sia}
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

export default AtletInput;