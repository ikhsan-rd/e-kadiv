import React,{ useState,useRef } from 'react';
import { Modal,Form,Button,Row,Col,Spinner,Container } from 'react-bootstrap';
import axios from 'axios';
import { SansDatePicker,SansDateToSend,SansNotify,SansMoneyInput,SansMoneyToSend,SansDivisiDropdown,SansFileInput } from '../ComponentCustom/SansComps';
import { Eye } from 'react-bootstrap-icons';

function DanaMasukInput()
{
    const currentToken = sessionStorage.getItem('token');
    const currentDivisi = sessionStorage.getItem('divisi');

    const [loading,setLoading] = useState(false);

    const [formDanaMasuk,setFormDanaMasuk] = useState({
        divisi: currentDivisi || "",
        tgl: null,
        sumber_dana: "",
        total: "",
    });

    const handleSumberDanaChange = (e) =>
    {
        setFormDanaMasuk(prevState => ({
            ...prevState,
            sumber_dana: e.target.value
        }));
    };

    const handleTotalChange = (value) =>
    {
        setFormDanaMasuk(prevState => ({
            ...prevState,
            total: value
        }));
        console.log(typeof total)
    };

    //Nota
    const notaInputRef = useRef(null);
    const [showModalNota,setShowModalNota] = useState(false);

    const handleNotaChange = (e) =>
    {
        const file = e.target.files[0];
        if (file)
        {
            setFormDanaMasuk((prevData) => ({
                ...prevData,
                nota: file,
            }));
        }
    };

    const handleCekNota = () =>
    {
        setShowModalNota(true);
    };

    const handleHapusNota = () =>
    {
        setFormDanaMasuk((prevData) => ({
            ...prevData,
            nota: null,
        }));
        setShowModalNota(false);
        if (notaInputRef.current)
        {
            notaInputRef.current.value = '';
        }
    };

    //submit
    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        if (!formDanaMasuk.tgl)
        {
            setErrorMessage('Tanggal harus dipilih');
            setStatus('error');
            setShowNotify(true);
            setLoading(false);
            return;
        }

        const data = new FormData();
        Object.keys(formDanaMasuk).forEach((key) =>
        {
            data.append(key,formDanaMasuk[key]);
        });

        if (formDanaMasuk.nota)
        {
            data.append("nota",formDanaMasuk.nota);
        }

        const dataToSend = {
            ...formDanaMasuk,
            tgl: SansDateToSend(formDanaMasuk.tgl),
            total: SansMoneyToSend(formDanaMasuk.total),
        };

        try
        {
            await axios.get("http://localhost:8000/sanctum/csrf-cookie",{
                withCredentials: true,
            });

            const response = await axios.post("http://localhost:8000/api/dana-masuk",dataToSend,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${currentToken}`,
                },
                withCredentials: true,
            });
            console.log('Response:',response.data);

            resetForm();
            setSuccessMessage('Dana Masuk berhasil ditambahkan');
            setStatus('success');
            setShowNotify(true);
        } catch (error)
        {
            if (error.response && error.response.data.message)
            {
                setErrorMessage(error.response.data.message);
            } else
            {
                setErrorMessage("Terjadi Kesalahan");
            }
            setStatus('error');
            setShowNotify(true);
        } finally
        {
            setLoading(false);
        }
    };

    const resetForm = () =>
    {
        setFormDanaMasuk({
            divisi: currentDivisi || "",
            tgl: null,
            sumber_dana: "",
            total: "",
        });
    };

    const [showNotify,setShowNotify] = useState(false);
    const [status,setStatus] = useState('');
    const [errorMessage,setErrorMessage] = useState('');
    const [successMessage,setSuccessMessage] = useState('');

    return (
        <>
                <Form onSubmit={handleSubmit}>
                    <Row style={{ marginBottom: '10px' }}>
                        <Form.Group as={Col} md={3}>
                            <Form.Label>Divisi</Form.Label>
                            <SansDivisiDropdown
                                value={formDanaMasuk.divisi}
                                onChange={(e) => setFormDanaMasuk({ ...formDanaMasuk,divisi: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <Form.Label>Tanggal</Form.Label>
                            <SansDatePicker
                                value={formDanaMasuk.tgl}
                                onChange={(date) => setFormDanaMasuk({ ...formDanaMasuk,tgl: date })}
                                onClear={() => setFormDanaMasuk({ ...formDanaMasuk,tgl: null })}
                                disabled={loading}
                            />
                        </Form.Group>
                    </Row>
                    <Row style={{ marginBottom: '15px' }}>
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Sumber Dana</Form.Label>
                            <Form.Control
                                type="text"
                                value={formDanaMasuk.sumber_dana}
                                onChange={handleSumberDanaChange}
                                disabled={loading}
                                required
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <Form.Label>Jumlah Dana</Form.Label>
                            <SansMoneyInput
                                type="number"
                                value={formDanaMasuk.total}
                                onChange={handleTotalChange}
                                disabled={loading}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={3}>
                            <Form.Label>Nota (pdf/image)</Form.Label>
                            <Form.Group style={{ display: 'flex' }}>
                                <Form.Control
                                    type="file"
                                    name="nota"
                                    onChange={handleNotaChange}
                                    required
                                    ref={notaInputRef}
                                    disabled={loading}
                                />
                                {formDanaMasuk.nota && (
                                    <Button variant="primary" onClick={handleCekNota} className='button-see'>
                                        <Eye className='eye-custom' />
                                    </Button>
                                )}
                            </Form.Group>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group>
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
                        </Form.Group>
                    </Row>
                </Form>

            {formDanaMasuk.nota && (
                <SansFileInput
                    show={showModalNota}
                    onHide={() => setShowModalNota(false)}
                    fileSrc={formDanaMasuk.nota}
                    onDelete={handleHapusNota}
                />
            )}

            <SansNotify
                show={showNotify}
                onHide={() => setShowNotify(false)}
                status={status}
                onSuccess={successMessage}
                onError={errorMessage}
            />
        </>
    );
}

export default DanaMasukInput;
