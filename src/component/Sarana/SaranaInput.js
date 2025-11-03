import React,{ useState,useEffect } from 'react';
import { Container,Form,Button,Row,Col,Spinner } from 'react-bootstrap';
import '../../css/button.scss'
import { SansDivisiDropdown,SansNotify } from '../ComponentCustom/SansComps';
import axios from 'axios';

function SaranaInput()
{
    const currentToken = sessionStorage.getItem('token');
    const currentDivisi = sessionStorage.getItem('divisi');

    //fetch satuan list
    const [loading,setLoading] = useState(false);
    const [satuanList,setSatuanList] = useState([]);

    useEffect(() =>
    {
        const fetchSatuanList = async () =>
        {
            setLoading(true);
            try
            {
                const response = await axios.get("http://localhost:8000/api/sarana",{
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                });
                const satuanListData = [...new Set(response.data.data.map(item => item.satuan))];
                setSatuanList(satuanListData);
            } catch (error)
            {
                console.error("Error fetching satuan list:",error);
            } finally
            {
                setLoading(false);
            }

        };

        fetchSatuanList();
    },[currentToken]);

    const [formData,setFormData] = useState({
        divisi:currentDivisi|| "",
        nama: "",
        jumlah: 0,
        satuan: "",
        layak_pakai: 0,
        tdk_layak_pakai: 0,
        keterangan: "",
    });

    // Handle perubahan data pada form
    const handleChange = (e) =>
    {
        const { name,value } = e.target;
        let newValue = value;

        setFormData((prevData) =>
        {
            const updatedData = { ...prevData,[name]: newValue };

            if (name === 'jumlah')
            {
                const layak = parseInt(updatedData.layak_pakai) || 0;
                const tdkLayak = parseInt(updatedData.tdk_layak_pakai) || 0;

                if (layak + tdkLayak > value)
                {
                    updatedData.layak_pakai = '';
                    updatedData.tdk_layak_pakai = '';
                }
            } else if (name === 'layak_pakai')
            {
                const jumlah = parseInt(updatedData.jumlah) || 0;
                updatedData.tdk_layak_pakai = jumlah - parseInt(newValue);
            } else if (name === 'tdk_layak_pakai')
            {
                const jumlah = parseInt(updatedData.jumlah) || 0;
                updatedData.layak_pakai = jumlah - parseInt(newValue);
            }

            return updatedData;
        });
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
            // Add akun request
            await axios.post("http://localhost:8000/api/sarana",data,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${currentToken}`,
                },
                withCredentials: true,
            });

            setFormData({
                divisi:currentDivisi|| "",
                nama: "",
                jumlah: 0,
                satuan: "",
                layak_pakai: 0,
                tdk_layak_pakai: 0,
                keterangan: "",
            });

            setSuccessMessage("Data berhasil ditambahkan");
            setStatus('success');
            setShowNotify(true);
        } catch (err)
        {
            if (err.response && err.response.data.message)
            {
                setErrorMessage(err.response.data.message);
            } else
            {
                setErrorMessage("Terjadi Kesalahan");
                console.error("Response data:",err.response.data);
            }
            setStatus('error');
            setShowNotify(true);
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
            <Container
                style={{
                    backgroundColor: "whitesmoke",
                    padding: "2%",
                    borderRadius: "10px",
                }}
            >
                <Form style={{ marginTop: '15px' }} onSubmit={handleSubmit}>
                    <h2>Tambah Sarana & Pra-sarana</h2>
                    <Row style={{ marginBottom: '15px' }}>
                        <Form.Group as={Col} md={3} controlId="divisi">
                            <Form.Label>Divisi</Form.Label>
                            <SansDivisiDropdown
                                value={formData.divisi}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                type="text"
                                name='nama'
                                placeholder="Nama Sarana"
                                value={formData.nama}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <Form.Label>Jumlah</Form.Label>
                            <Form.Control
                                type="number"
                                name='jumlah'
                                placeholder="Jumlah"
                                value={formData.jumlah}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <Form.Label>Satuan</Form.Label>
                            <Form.Control
                                list="satuanOptions"
                                type='text'
                                name='satuan'
                                placeholder="Satuan"
                                value={formData.satuan}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <datalist id="satuanOptions">
                                {satuanList.map((satuan,index) => (
                                    <option key={index} value={satuan}>{satuan}</option>
                                ))}
                            </datalist>
                        </Form.Group>
                    </Row>
                    <Row style={{ marginBottom: '20px' }}>
                        <Form.Group as={Col} md={3} >
                            <Form.Label>Layak Pakai</Form.Label>
                            <Form.Control
                                type="number"
                                name='layak_pakai'
                                placeholder="Layak Pakai"
                                value={formData.layak_pakai}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={3} >
                            <Form.Label>Tidak Layak Pakai</Form.Label>
                            <Form.Control
                                type="number"
                                name='tdk_layak_pakai'
                                placeholder="Tidak layak Pakai"
                                value={formData.tdk_layak_pakai}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={6} >
                            <Form.Label>keterangan</Form.Label>
                            <Form.Control
                                type="text"
                                name='keterangan'
                                placeholder="Keterangan"
                                value={formData.keterangan}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Form.Group>
                    </Row>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                        style={{ width: "30%",margin: "5px 35% 0 35%" }}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
                    </Button>
                </Form>
            </Container>

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
export default SaranaInput;